import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { BidProvider } from '@/context/BidContext'
import { VehicleCard } from './VehicleCard'
import type { Vehicle } from '@/types/vehicle'

function createVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
  return {
    id: 'test-id-1',
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
    images: ['https://placehold.co/800x600?text=Test'],
    selling_dealership: 'Test Dealer',
    lot: 'A-0001',
    current_bid: 16000,
    bid_count: 5,
    ...overrides,
  }
}

function renderCard(vehicle: Vehicle) {
  return render(
    <MemoryRouter>
      <BidProvider>
        <VehicleCard vehicle={vehicle} />
      </BidProvider>
    </MemoryRouter>,
  )
}

describe('VehicleCard', () => {
  it('renders vehicle title (year make model)', () => {
    renderCard(createVehicle())
    expect(screen.getByText('2022 Toyota Camry')).toBeInTheDocument()
  })

  it('renders trim', () => {
    renderCard(createVehicle())
    expect(screen.getByText('SE')).toBeInTheDocument()
  })

  it('displays current bid when bids exist', () => {
    renderCard(createVehicle({ current_bid: 16000 }))
    expect(screen.getByText('$16,000')).toBeInTheDocument()
  })

  it('displays starting bid when no bids exist', () => {
    renderCard(createVehicle({ current_bid: null, bid_count: 0, starting_bid: 15000 }))
    expect(screen.getByText('$15,000')).toBeInTheDocument()
  })

  it('shows bid count', () => {
    renderCard(createVehicle({ bid_count: 5 }))
    expect(screen.getByText('5 bids')).toBeInTheDocument()
  })

  it('shows singular bid text for 1 bid', () => {
    renderCard(createVehicle({ bid_count: 1 }))
    expect(screen.getByText('1 bid')).toBeInTheDocument()
  })

  it('shows "No bids yet" when bid count is 0', () => {
    renderCard(createVehicle({ bid_count: 0 }))
    expect(screen.getByText('No bids yet')).toBeInTheDocument()
  })

  it('renders odometer with formatting', () => {
    renderCard(createVehicle({ odometer_km: 50000 }))
    expect(screen.getByText('50,000 km')).toBeInTheDocument()
  })

  it('renders location', () => {
    renderCard(createVehicle({ city: 'Toronto', province: 'Ontario' }))
    expect(screen.getByText('Toronto, Ontario')).toBeInTheDocument()
  })

  it('renders lot number', () => {
    renderCard(createVehicle({ lot: 'A-0001' }))
    expect(screen.getByText('Lot A-0001')).toBeInTheDocument()
  })

  it('renders condition grade badge', () => {
    renderCard(createVehicle({ condition_grade: 3.5 }))
    expect(screen.getByText('3.5')).toBeInTheDocument()
  })

  it('links to the vehicle detail page', () => {
    renderCard(createVehicle({ id: 'test-id-1' }))
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/vehicles/test-id-1')
  })

  it('renders vehicle image with alt text', () => {
    renderCard(createVehicle())
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', '2022 Toyota Camry')
  })
})
