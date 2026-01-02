# Sheesh - Mosaic Mirror Art

A modern, interactive, and minimalist e-commerce showcase website for Sheesh, featuring handcrafted mosaic mirrorworks, disco balls, and reflective artistic products.

## Features

- **Interactive Hero Section** - Full-viewport hero with animated typography and scroll indicator
- **Dynamic Product Showcase** - MongoDB-backed product management with detailed views
- **Events Gallery** - Showcase of past events and exhibitions
- **Admin Dashboard** - Secure interface to manage products, stock, and events
- **Smooth Scroll Animations** - Framer Motion & GSAP powered animations
- **Image Optimization** - Cloudinary integration for efficient media delivery
- **Responsive Design** - Mobile-first approach with breakpoints for all devices
- **Modern UI Components** - reusable design system
- **3D Elements** - Spline and OGL integration for immersive visuals

## Tech Stack

- **Next.js 15.1** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **MongoDB** - Database for products and events
- **Cloudinary** - Image and media management
- **Framer Motion & GSAP** - Advanced animation libraries
- **Embla Carousel** - Smooth, performant carousels
- **Spline & OGL** - 3D interactive elements

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB Database
- Cloudinary Account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PASSWORD=your_secure_admin_password
```

### Database Setup

After configuring your environment variables, run the following command to set up database indexes for optimal performance:

```bash
npm run setup-indexes
```

### Development Server

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Access

Access the admin dashboard at `/admin`. The default password is configured via `ADMIN_PASSWORD`.

## Project Structure

```
sheeshWeb/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard
│   │   ├── api/          # API routes (products, events, upload, auth)
│   │   ├── events/       # Events showcase
│   │   ├── products/     # Product listing and details
│   │   └── ...
│   ├── components/
│   │   ├── admin/        # Admin specific components (Dashboard, Forms)
│   │   ├── animations/   # Shared animation components
│   │   ├── events/       # Event specific components
│   │   ├── home/         # Homepage sections
│   │   ├── layout/       # Global layout (Header, Footer)
│   │   └── ui/           # Shared UI kit
│   ├── lib/
│   │   ├── mongodb.ts    # DB Connection
│   │   └── ...
│   └── types/            # TypeScript definitions
└── public/               # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add the Environment Variables in Vercel project settings
4. Deploy

## License

All rights reserved - Sheesh 2026