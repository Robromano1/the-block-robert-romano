import type { Vehicle } from '@/types/vehicle'
import vehicleData from '../../data/vehicles.json'

const vehicleMap = new Map<string, Vehicle>(
  (vehicleData as Vehicle[]).map((v) => [v.id, v]),
)

export function useVehicle(id: string | undefined): Vehicle | undefined {
  if (!id) return undefined
  return vehicleMap.get(id)
}
