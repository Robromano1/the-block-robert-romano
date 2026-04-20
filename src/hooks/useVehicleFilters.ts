import { useState, useMemo } from 'react'
import type { Vehicle, VehicleFilters, SortOption } from '@/types/vehicle'

const DEFAULT_FILTERS: VehicleFilters = {
  search: '',
  make: '',
  bodyStyle: '',
  province: '',
  priceMin: '',
  priceMax: '',
  sort: 'lot',
}

function getEffectivePrice(vehicle: Vehicle): number {
  return vehicle.current_bid ?? vehicle.starting_bid
}

function matchesSearch(vehicle: Vehicle, query: string): boolean {
  const normalizedQuery = query.toLowerCase()
  return [
    vehicle.make,
    vehicle.model,
    vehicle.trim,
    String(vehicle.year),
    vehicle.vin,
    vehicle.lot,
  ].some((field) => field.toLowerCase().includes(normalizedQuery))
}

function applyFilters(vehicles: Vehicle[], filters: VehicleFilters): Vehicle[] {
  return vehicles.filter((vehicle) => {
    if (filters.search && !matchesSearch(vehicle, filters.search)) return false
    if (filters.make && vehicle.make !== filters.make) return false
    if (filters.bodyStyle && vehicle.body_style !== filters.bodyStyle) return false
    if (filters.province && vehicle.province !== filters.province) return false

    const price = getEffectivePrice(vehicle)
    const min = Number(filters.priceMin)
    const max = Number(filters.priceMax)
    if (filters.priceMin && price < min) return false
    if (filters.priceMax && price > max) return false

    return true
  })
}

function applySort(vehicles: Vehicle[], sort: SortOption): Vehicle[] {
  const sorted = [...vehicles]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b))
    case 'price-desc':
      return sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a))
    case 'year-asc':
      return sorted.sort((a, b) => a.year - b.year)
    case 'year-desc':
      return sorted.sort((a, b) => b.year - a.year)
    case 'lot':
    default:
      return sorted.sort((a, b) => a.lot.localeCompare(b.lot))
  }
}

export function useVehicleFilters(vehicles: Vehicle[]) {
  const [filters, setFilters] = useState<VehicleFilters>(DEFAULT_FILTERS)

  const filteredVehicles = useMemo(
    () => applySort(applyFilters(vehicles, filters), filters.sort),
    [vehicles, filters],
  )

  function updateFilter<K extends keyof VehicleFilters>(key: K, value: VehicleFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value !== DEFAULT_FILTERS[key as keyof VehicleFilters],
  )

  return { filters, filteredVehicles, updateFilter, resetFilters, hasActiveFilters }
}
