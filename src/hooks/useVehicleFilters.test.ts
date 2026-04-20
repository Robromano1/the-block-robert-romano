import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useVehicleFilters } from './useVehicleFilters'
import type { Vehicle } from '@/types/vehicle'

function createVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
  return {
    id: '1',
    vin: 'ABC123',
    year: 2022,
    make: 'Toyota',
    model: 'Camry',
    trim: 'SE',
    body_style: 'Sedan',
    exterior_color: 'Blue',
    interior_color: 'Black',
    engine: '2.5L I4',
    transmission: 'automatic',
    drivetrain: 'FWD',
    odometer_km: 50000,
    fuel_type: 'gasoline',
    condition_grade: 3.5,
    condition_report: 'Good condition',
    damage_notes: [],
    title_status: 'clean',
    province: 'Ontario',
    city: 'Toronto',
    auction_start: '2026-04-05T14:00:00',
    starting_bid: 15000,
    reserve_price: 20000,
    buy_now_price: null,
    images: ['https://placehold.co/800x600'],
    selling_dealership: 'Test Dealer',
    lot: 'A-0001',
    current_bid: 16000,
    bid_count: 5,
    ...overrides,
  }
}

const VEHICLES: Vehicle[] = [
  createVehicle({ id: '1', make: 'Toyota', model: 'Camry', year: 2022, lot: 'A-0001', current_bid: 16000, province: 'Ontario', body_style: 'Sedan' }),
  createVehicle({ id: '2', make: 'Ford', model: 'F-150', year: 2021, lot: 'A-0002', current_bid: 35000, province: 'Alberta', body_style: 'Truck' }),
  createVehicle({ id: '3', make: 'Honda', model: 'Civic', year: 2023, lot: 'A-0003', current_bid: null, starting_bid: 12000, bid_count: 0, province: 'Ontario', body_style: 'Sedan' }),
  createVehicle({ id: '4', make: 'Toyota', model: 'RAV4', year: 2020, lot: 'A-0004', current_bid: 22000, province: 'British Columbia', body_style: 'SUV', vin: 'XYZ789' }),
]

describe('useVehicleFilters', () => {
  it('returns all vehicles with default filters', () => {
    const { result } = renderHook(() => useVehicleFilters(VEHICLES))
    expect(result.current.filteredVehicles).toHaveLength(4)
  })

  it('reports no active filters initially', () => {
    const { result } = renderHook(() => useVehicleFilters(VEHICLES))
    expect(result.current.hasActiveFilters).toBe(false)
  })

  describe('text search', () => {
    it('filters by make', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('search', 'Toyota'))
      expect(result.current.filteredVehicles).toHaveLength(2)
    })

    it('filters by model', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('search', 'Civic'))
      expect(result.current.filteredVehicles).toHaveLength(1)
      expect(result.current.filteredVehicles[0].id).toBe('3')
    })

    it('filters by year', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('search', '2023'))
      expect(result.current.filteredVehicles).toHaveLength(1)
    })

    it('filters by VIN', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('search', 'XYZ789'))
      expect(result.current.filteredVehicles).toHaveLength(1)
      expect(result.current.filteredVehicles[0].id).toBe('4')
    })

    it('filters by lot number', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('search', 'A-0002'))
      expect(result.current.filteredVehicles).toHaveLength(1)
      expect(result.current.filteredVehicles[0].id).toBe('2')
    })

    it('is case-insensitive', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('search', 'toyota'))
      expect(result.current.filteredVehicles).toHaveLength(2)
    })

    it('returns empty array for non-matching search', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('search', 'Lamborghini'))
      expect(result.current.filteredVehicles).toHaveLength(0)
    })
  })

  describe('dropdown filters', () => {
    it('filters by make', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('make', 'Ford'))
      expect(result.current.filteredVehicles).toHaveLength(1)
      expect(result.current.filteredVehicles[0].model).toBe('F-150')
    })

    it('filters by body style', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('bodyStyle', 'Sedan'))
      expect(result.current.filteredVehicles).toHaveLength(2)
    })

    it('filters by province', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('province', 'Ontario'))
      expect(result.current.filteredVehicles).toHaveLength(2)
    })
  })

  describe('price range', () => {
    it('filters by minimum price', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('priceMin', '20000'))
      expect(result.current.filteredVehicles).toHaveLength(2)
    })

    it('filters by maximum price', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('priceMax', '16000'))
      expect(result.current.filteredVehicles).toHaveLength(2)
    })

    it('filters by price range (min and max)', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => {
        result.current.updateFilter('priceMin', '15000')
        result.current.updateFilter('priceMax', '25000')
      })
      expect(result.current.filteredVehicles).toHaveLength(2)
    })

    it('uses starting_bid when current_bid is null', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('priceMax', '12000'))
      expect(result.current.filteredVehicles).toHaveLength(1)
      expect(result.current.filteredVehicles[0].id).toBe('3')
    })
  })

  describe('combined filters', () => {
    it('applies multiple filters together', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => {
        result.current.updateFilter('province', 'Ontario')
        result.current.updateFilter('bodyStyle', 'Sedan')
      })
      expect(result.current.filteredVehicles).toHaveLength(2)
    })

    it('narrows results with search + dropdown', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => {
        result.current.updateFilter('province', 'Ontario')
        result.current.updateFilter('search', 'Camry')
      })
      expect(result.current.filteredVehicles).toHaveLength(1)
      expect(result.current.filteredVehicles[0].id).toBe('1')
    })
  })

  describe('sorting', () => {
    it('sorts by lot number by default', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      const lots = result.current.filteredVehicles.map((v) => v.lot)
      expect(lots).toEqual(['A-0001', 'A-0002', 'A-0003', 'A-0004'])
    })

    it('sorts by price ascending', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('sort', 'price-asc'))
      const prices = result.current.filteredVehicles.map((v) => v.current_bid ?? v.starting_bid)
      expect(prices).toEqual([12000, 16000, 22000, 35000])
    })

    it('sorts by price descending', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('sort', 'price-desc'))
      const prices = result.current.filteredVehicles.map((v) => v.current_bid ?? v.starting_bid)
      expect(prices).toEqual([35000, 22000, 16000, 12000])
    })

    it('sorts by year newest first', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('sort', 'year-desc'))
      const years = result.current.filteredVehicles.map((v) => v.year)
      expect(years).toEqual([2023, 2022, 2021, 2020])
    })

    it('sorts by year oldest first', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('sort', 'year-asc'))
      const years = result.current.filteredVehicles.map((v) => v.year)
      expect(years).toEqual([2020, 2021, 2022, 2023])
    })
  })

  describe('reset', () => {
    it('clears all filters', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => {
        result.current.updateFilter('search', 'Toyota')
        result.current.updateFilter('province', 'Ontario')
        result.current.updateFilter('sort', 'price-desc')
      })
      expect(result.current.filteredVehicles.length).toBeLessThan(4)

      act(() => result.current.resetFilters())
      expect(result.current.filteredVehicles).toHaveLength(4)
      expect(result.current.hasActiveFilters).toBe(false)
    })

    it('marks hasActiveFilters true when any filter is set', () => {
      const { result } = renderHook(() => useVehicleFilters(VEHICLES))
      act(() => result.current.updateFilter('make', 'Toyota'))
      expect(result.current.hasActiveFilters).toBe(true)
    })
  })
})
