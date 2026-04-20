import { useParams, Link } from 'react-router'

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        ← Back to Inventory
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        Vehicle Detail
      </h1>
      <p className="mt-2 text-gray-600">
        Viewing vehicle: <code className="bg-gray-100 px-2 py-1 rounded">{id}</code>
      </p>
    </div>
  )
}
