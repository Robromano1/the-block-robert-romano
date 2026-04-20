import { Link } from 'react-router'

export function InventoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Vehicle Inventory</h1>
      <p className="mt-2 text-gray-600">
        Browse available vehicles and place your bids.
      </p>
      <div className="mt-8 text-gray-500">
        <Link
          to="/vehicles/test"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View sample vehicle detail →
        </Link>
      </div>
    </div>
  )
}
