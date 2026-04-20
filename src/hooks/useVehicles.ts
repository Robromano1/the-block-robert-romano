import { useMemo } from 'react'
import type { Vehicle } from '@/types/vehicle'
import vehicleData from '../../data/vehicles.json'

export function useVehicles() {
  const vehicles = vehicleData as Vehicle[]

  const makes = useMemo(
    () => [...new Set(vehicles.map((v) => v.make))].sort(),
    [vehicles],
  )

  const bodyStyles = useMemo(
    () => [...new Set(vehicles.map((v) => v.body_style))].sort(),
    [vehicles],
  )

  const provinces = useMemo(
    () => [...new Set(vehicles.map((v) => v.province))].sort(),
    [vehicles],
  )

  return { vehicles, makes, bodyStyles, provinces }
}
