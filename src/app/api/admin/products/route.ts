import { NextRequest, NextResponse } from 'next/server'
import { getProducts, addProduct, getProductCount } from '@/lib/products-db'
import { Product } from '@/types'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 60

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.substring(7)
  return token === ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const skip = (page - 1) * limit

    const [products, totalCount] = await Promise.all([
      getProducts(limit, skip),
      getProductCount()
    ])

    return NextResponse.json({
      products,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    }, {
      headers: {
        'Cache-Control': 'private, max-age=60',
      }
    })
  } catch (error) {
    console.error('Failed to get products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const product: Product = await request.json()
    const newProduct = await addProduct(product)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Invalid product data' }, { status: 400 })
  }
}
