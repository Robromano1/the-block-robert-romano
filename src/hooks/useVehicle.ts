import { useMemo } from 'react'
import type { Vehicle } from '@/types/vehicle'
import vehicleData from '../../data/vehicles.json'

export function useVehicle(id: string | undefined): Vehicle | undefined {
  const vehicles = vehicleData as Vehicle[]
  return useMemo(() => vehicles.find((v) => v.id === id), [vehicles, id])
}
