import { StockManager } from '@/components/admin/StockManager'

export const metadata = {
  title: 'Admin - Stock Management',
  description: 'Manage product inventory and stock',
}

export default function AdminPage() {
  return <StockManager />
}
