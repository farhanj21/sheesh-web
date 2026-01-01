import { NextResponse } from 'next/server'
import { getVisibleProducts } from '@/lib/products-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const products = getVisibleProducts()
  return NextResponse.json(products)
}
