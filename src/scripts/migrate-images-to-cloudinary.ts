import { v2 as cloudinary } from 'cloudinary'
import { MongoClient } from 'mongodb'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI || ''
const MONGODB_DB = process.env.MONGODB_DB || 'sheesh'

async function uploadBase64ToCloudinary(base64: string, productId: string, imageIndex: number): Promise<{ url: string, width: number, height: number }> {
  try {
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'sheesh-products',
      public_id: `${productId}-${imageIndex}`,
      resource_type: 'image',
    })

    return {
      url: result.secure_url,
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    console.error('Failed to upload to Cloudinary:', error)
    throw error
  }
}

async function migrateProducts() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db(MONGODB_DB)
    const productsCollection = db.collection('products')

    // Find all products with base64 images
    const products = await productsCollection.find({
      'images.src': { $regex: '^data:image' }
    }).toArray()

    console.log(`Found ${products.length} products with base64 images`)

    for (const product of products) {
      console.log(`\nMigrating product: ${product.name} (${product.id})`)

      const updatedImages = []

      for (let i = 0; i < product.images.length; i++) {
        const image = product.images[i]

        // Check if image is base64
        if (image.src.startsWith('data:image')) {
          console.log(`  Uploading image ${i + 1}/${product.images.length}...`)

          try {
            const { url, width, height } = await uploadBase64ToCloudinary(
              image.src,
              product.id,
              i
            )

            updatedImages.push({
              ...image,
              src: url,
              width: width || image.width,
              height: height || image.height,
            })

            console.log(`  ✓ Image ${i + 1} uploaded: ${url}`)
          } catch (error) {
            console.error(`  ✗ Failed to upload image ${i + 1}:`, error)
            // Keep original base64 if upload fails
            updatedImages.push(image)
          }
        } else {
          // Already a URL, keep as is
          updatedImages.push(image)
        }
      }

      // Update product in database
      await productsCollection.updateOne(
        { id: product.id },
        { $set: { images: updatedImages } }
      )

      console.log(`✓ Product ${product.name} migrated successfully`)
    }

    console.log('\n========================================')
    console.log('Migration completed!')
    console.log(`Total products migrated: ${products.length}`)
    console.log('========================================')

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

// Run migration
migrateProducts()
  .then(() => {
    console.log('\nAll done! Your products now use Cloudinary URLs.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\nMigration error:', error)
    process.exit(1)
  })
