import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { BidProvider } from '@/context/BidContext'
import { VehicleDetailPage } from './VehicleDetailPage'
import vehicleData from '../../data/vehicles.json'
import type { Vehicle } from '@/types/vehicle'

const testVehicle = vehicleData[0] as Vehicle

function renderDetailPage(vehicleId: string) {
  return render(
    <BidProvider>
      <MemoryRouter initialEntries={[`/vehicles/${vehicleId}`]}>
        <Routes>
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
        </Routes>
      </MemoryRouter>
    </BidProvider>,
  )
}

describe('VehicleDetailPage', () => {
  describe('when vehicle exists', () => {
    it('renders vehicle title', () => {
      renderDetailPage(testVehicle.id)
      expect(
        screen.getByText(`${testVehicle.year} ${testVehicle.make} ${testVehicle.model}`),
      ).toBeInTheDocument()
    })

    it('renders trim', () => {
      renderDetailPage(testVehicle.id)
      expect(screen.getByText(testVehicle.trim)).toBeInTheDocument()
    })

    it('renders lot number', () => {
      renderDetailPage(testVehicle.id)
      expect(screen.getByText(`Lot ${testVehicle.lot}`)).toBeInTheDocument()
    })

    it('renders VIN', () => {
      renderDetailPage(testVehicle.id)
      expect(screen.getByText(testVehicle.vin)).toBeInTheDocument()
    })

    it('renders back to inventory link', () => {
      renderDetailPage(testVehicle.id)
      const link = screen.getByRole('link', { name: /back to inventory/i })
      expect(link).toHaveAttribute('href', '/')
    })

    it('displays the main image', () => {
      renderDetailPage(testVehicle.id)
      const mainImage = screen.getByAltText(
        `${testVehicle.year} ${testVehicle.make} ${testVehicle.model} - Photo 1`,
      )
      expect(mainImage).toBeInTheDocument()
    })

    it('renders thumbnail buttons for multiple images', () => {
      renderDetailPage(testVehicle.id)
      const thumbnails = screen.getAllByAltText(/Thumbnail/)
      expect(thumbnails.length).toBe(testVehicle.images.length)
    })

    it('changes main image when thumbnail is clicked', async () => {
      const user = userEvent.setup()
      renderDetailPage(testVehicle.id)

      const thumbnails = screen.getAllByRole('button')
      await user.click(thumbnails[1])

      const mainImage = screen.getByAltText(
        `${testVehicle.year} ${testVehicle.make} ${testVehicle.model} - Photo 2`,
      )
      expect(mainImage).toBeInTheDocument()
    })
  })

  describe('specifications', () => {
    it('renders engine', () => {
      renderDetailPage(testVehicle.id)
      expect(screen.getByText(testVehicle.engine)).toBeInTheDocument()
    })

    it('renders transmission', () => {
      renderDetailPage(testVehicle.id)
      expect(screen.getByText(testVehicle.transmission)).toBeInTheDocument()
    })

    it('renders drivetrain', () => {
      renderDetailPage(testVehicle.id)
      expect(screen.getByText(testVehicle.drivetrain)).toBeInTheDocument()
    })

    it('renders odometer', () => {
      renderDetailPage(testVehicle.id)
      expect(
        screen.getByText(`${testVehicle.odometer_km.toLocaleString()} km`),
      ).toBeInTheDocument()
    })

    it('renders exterior color', () => {
      renderDetailPage(testVehicle.id)
      expect(screen.getByText(testVehicle.exterior_color)).toBeInTheDocument()
    })

    it('renders body style', () => {
      renderDetailPage(testVehicle.id)
      expect(screen.getByText(testVehicle.body_style)).toBeInTheDocument()
    })
  })

  describe('condition', () => {
    it('renders condition grade', () => {
      renderDetailPage(testVehicle.id)
      expect(
        screen.getByText(`${testVehicle.condition_grade.toFixed(1)} / 5.0`),
      ).toBeInTheDocument()
    })

    it('renders condition report', () => {
      renderDetailPage(testVehicle.id)
      expect(screen.getByText(testVehicle.condition_report)).toBeInTheDocument()
    })

    it('renders title status', () => {
      renderDetailPage(testVehicle.id)
      expect(screen.getByText(testVehicle.title_status)).toBeInTheDocument()
    })
  })

  describe('pricing', () => {
    it('displays current bid when bids exist', () => {
      renderDetailPage(testVehicle.id)
      const formatted = new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
      }).format(testVehicle.current_bid!)
      expect(screen.getByText(formatted)).toBeInTheDocument()
    })

    it('shows bid count', () => {
      renderDetailPage(testVehicle.id)
      expect(
        screen.getByText(`${testVehicle.bid_count} bids`),
      ).toBeInTheDocument()
    })
  })

  describe('seller', () => {
    it('renders dealership name', () => {
      renderDetailPage(testVehicle.id)
      expect(screen.getByText(testVehicle.selling_dealership)).toBeInTheDocument()
    })

    it('renders location', () => {
      renderDetailPage(testVehicle.id)
      expect(
        screen.getByText(`${testVehicle.city}, ${testVehicle.province}`),
      ).toBeInTheDocument()
    })
  })

  describe('when vehicle does not exist', () => {
    it('shows not found message', () => {
      renderDetailPage('non-existent-id')
      expect(screen.getByText('Vehicle Not Found')).toBeInTheDocument()
    })

    it('still shows back link', () => {
      renderDetailPage('non-existent-id')
      const link = screen.getByRole('link', { name: /back to inventory/i })
      expect(link).toHaveAttribute('href', '/')
    })
  })
})
