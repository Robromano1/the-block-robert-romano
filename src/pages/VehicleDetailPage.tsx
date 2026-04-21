import { useParams, Link } from 'react-router'
import { useVehicle } from '@/hooks/useVehicle'
import { useBidContext } from '@/context/BidContext'
import { ImageGallery } from '@/components/ImageGallery'
import { BidForm } from '@/components/BidForm'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function ConditionBadge({ grade }: { grade: number }) {
  let color = 'bg-red-100 text-red-700'
  if (grade >= 4) color = 'bg-green-100 text-green-700'
  else if (grade >= 3) color = 'bg-yellow-100 text-yellow-700'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${color}`}>
      {grade.toFixed(1)} / 5.0
    </span>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const vehicle = useVehicle(id)

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            &larr; Back to Inventory
          </Link>
          <div className="mt-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Not Found</h1>
            <p className="mt-2 text-gray-500">The vehicle you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const { getEffectiveBid, getEffectiveBidCount, placeBid } = useBidContext()
  const effectivePrice = getEffectiveBid(vehicle.id, vehicle.current_bid, vehicle.starting_bid)
  const effectiveBidCount = getEffectiveBidCount(vehicle.id, vehicle.bid_count)
  const hasBids = effectiveBidCount > 0
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          &larr; Back to Inventory
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <ImageGallery images={vehicle.images} alt={title} />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-gray-500">
                <span>Lot {vehicle.lot}</span>
                <span>&middot;</span>
                <span className="break-all">{vehicle.vin}</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h1>
              <p className="mt-0.5 text-lg text-gray-600">{vehicle.trim}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {hasBids ? 'Current Bid' : 'Starting Bid'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(effectivePrice)}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {hasBids ? `${effectiveBidCount} bid${effectiveBidCount !== 1 ? 's' : ''}` : 'No bids yet'}
                </p>
              </div>
              {vehicle.reserve_price && (
                <p className="mt-2 text-sm text-gray-500">
                  Reserve: {formatCurrency(vehicle.reserve_price)}
                  {effectivePrice >= vehicle.reserve_price && (
                    <span className="ml-2 text-green-600 font-medium">Met</span>
                  )}
                </p>
              )}
              {vehicle.buy_now_price && (
                <p className="mt-1 text-sm text-gray-500">
                  Buy Now: {formatCurrency(vehicle.buy_now_price)}
                </p>
              )}
            </div>

            <BidForm
              currentHighest={effectivePrice}
              onPlaceBid={(amount) => placeBid(vehicle.id, amount)}
            />

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
              <div className="mt-3">
                <SpecRow label="Body Style" value={vehicle.body_style} />
                <SpecRow label="Engine" value={vehicle.engine} />
                <SpecRow label="Transmission" value={vehicle.transmission} />
                <SpecRow label="Drivetrain" value={vehicle.drivetrain} />
                <SpecRow label="Fuel Type" value={vehicle.fuel_type} />
                <SpecRow label="Odometer" value={`${vehicle.odometer_km.toLocaleString()} km`} />
                <SpecRow label="Exterior" value={vehicle.exterior_color} />
                <SpecRow label="Interior" value={vehicle.interior_color} />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Condition</h2>
                <ConditionBadge grade={vehicle.condition_grade} />
              </div>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                {vehicle.condition_report}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                Title Status: <span className="font-medium capitalize text-gray-700">{vehicle.title_status}</span>
              </div>
              {vehicle.damage_notes.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">Damage Notes</h3>
                  <ul className="mt-2 space-y-1">
                    {vehicle.damage_notes.map((note, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-gray-900">Seller</h2>
              <p className="mt-2 text-sm font-medium text-gray-900">{vehicle.selling_dealership}</p>
              <p className="text-sm text-gray-500">{vehicle.city}, {vehicle.province}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
