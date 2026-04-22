import { Link } from 'react-router'
import type { Vehicle } from '@/types/vehicle'
import { formatCurrency } from '@/lib/format'
import { ConditionBadge } from '@/components/ConditionBadge'

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const effectivePrice = vehicle.current_bid ?? vehicle.starting_bid
  const hasBids = vehicle.bid_count > 0

  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="group block rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm transition hover:shadow-md hover:border-gray-300"
    >
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 leading-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <ConditionBadge grade={vehicle.condition_grade} />
        </div>
        <p className="mt-0.5 text-sm text-gray-500">{vehicle.trim}</p>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(effectivePrice)}</p>
            <p className="text-xs text-gray-500">
              {hasBids ? `${vehicle.bid_count} bid${vehicle.bid_count !== 1 ? 's' : ''}` : 'No bids yet'}
            </p>
          </div>
          <p className="text-sm text-gray-500">{vehicle.odometer_km.toLocaleString()} km</p>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>{vehicle.city}, {vehicle.province}</span>
          <span>Lot {vehicle.lot}</span>
        </div>
      </div>
    </Link>
  )
}
