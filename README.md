# Sheesh - Reflective Art & Disco Balls

A modern, interactive, and minimalist e-commerce showcase website for Sheesh, featuring handcrafted mosaic mirrorworks, disco balls, and reflective artistic products.

## Features

- **Interactive Hero Section** - Full-viewport hero with animated typography and scroll indicator
- **Smooth Scroll Animations** - Framer Motion powered animations throughout the site
- **Product Showcase** - Featured products carousel with Embla Carousel
- **Responsive Design** - Mobile-first approach with breakpoints for all devices
- **Product Grid** - Dedicated products page with quick view modals
- **About Page** - Story-driven content with staggered animations
- **Modern UI Components** - Reusable button, card, modal, and carousel components
- **External Checkout Integration** - Ready for Shopify/Square integration

## Tech Stack

- **Next.js 15.1** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Embla Carousel** - Smooth, performant carousels
- **React Intersection Observer** - Scroll-triggered animations

## Getting Started

### Development Server

```bash
npm run dev
```

Open [http://localhost:3004](http://localhost:3004) (or the port shown in your terminal) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
sheeshWeb/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout with Header/Footer
│   │   ├── page.tsx      # Homepage
│   │   ├── products/     # Products listing page
│   │   └── about/        # About page
│   ├── components/
│   │   ├── animations/   # FadeIn, SlideIn, ParallaxSection
│   │   ├── home/         # Hero, FeaturedProducts, AboutSection, CTASection
│   │   ├── layout/       # Header, Footer
│   │   ├── products/     # ProductCard, ProductGrid
│   │   └── ui/           # Button, Card, Modal, Carousel
│   ├── lib/
│   │   ├── animations.ts # Framer Motion variants
│   │   └── utils.ts      # Utility functions
│   ├── data/
│   │   └── products.ts   # Sample product data
│   └── types/
│       └── index.ts      # TypeScript type definitions
└── public/
    └── images/           # Product and hero images
```

## Customization

### Colors

Edit the color palette in `tailwind.config.ts`:

```typescript
colors: {
  primary: { ... },      // Main brand color (indigo)
  accent: {
    gold: '#d4af37',
    silver: '#c0c0c0',
    disco: '#ff00ff',
  },
}
```

### Products

Add your products in `src/data/products.ts`. Each product includes:
- Name, description, price
- Images (place in `public/images/products/`)
- Category, materials, dimensions
- External checkout URL (Shopify/Square)

### External Checkout

Update `externalCheckoutUrl` in each product to point to your Shopify/Square product page.

## Adding Product Images

1. Place product images in `public/images/products/`
2. Update the `images` array in each product
3. Replace placeholder emoji with Next.js Image components in ProductCard

Example:

```tsx
import Image from 'next/image'

<Image
  src={product.images[0].src}
  alt={product.images[0].alt}
  width={product.images[0].width}
  height={product.images[0].height}
  className="object-cover"
/>
```

## Performance

- **Lighthouse Score Target**: >90
- **LCP**: <2.5s
- **CLS**: <0.1
- Images optimized with Next.js Image component
- Lazy loading for below-the-fold content
- Smooth animations using GPU-accelerated transforms

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy with one click

```bash
# Or use Vercel CLI
npm i -g vercel
vercel deploy
```

### Other Platforms

Compatible with Netlify, Cloudflare Pages, and other Next.js hosting providers.

## Next Steps

1. **Add Real Product Images** - Replace placeholder emojis with actual product photography
2. **Set Up E-commerce Platform** - Create Shopify/Square account and add products
3. **Update Product URLs** - Link each product to external checkout
4. **Customize Content** - Update copy in Hero, About, and product descriptions
5. **Add Analytics** - Integrate Google Analytics or similar
6. **Set Up Domain** - Configure custom domain in your hosting platform
7. **SEO Optimization** - Add meta descriptions, structured data, sitemap

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

All rights reserved - Sheesh 2025
