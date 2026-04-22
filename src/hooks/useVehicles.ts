import type { Vehicle } from '@/types/vehicle'
import vehicleData from '../../data/vehicles.json'

const vehicles = vehicleData as Vehicle[]
const makes = [...new Set(vehicles.map((v) => v.make))].sort()
const bodyStyles = [...new Set(vehicles.map((v) => v.body_style))].sort()
const provinces = [...new Set(vehicles.map((v) => v.province))].sort()

export function useVehicles() {
  return { vehicles, makes, bodyStyles, provinces }
}
