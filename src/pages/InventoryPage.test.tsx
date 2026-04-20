import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { InventoryPage } from './InventoryPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <InventoryPage />
    </MemoryRouter>,
  )
}

describe('InventoryPage', () => {
  it('renders the page header', () => {
    renderPage()
    expect(screen.getByText('The Block')).toBeInTheDocument()
  })

  it('displays vehicle count', () => {
    renderPage()
    expect(screen.getByText(/200 of 200 vehicles/)).toBeInTheDocument()
  })

  it('renders vehicle cards', () => {
    renderPage()
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('filters vehicles via search input', async () => {
    const user = userEvent.setup()
    renderPage()

    const searchInput = screen.getByPlaceholderText(/Search by make/i)
    await user.type(searchInput, 'Mazda')

    expect(screen.getByText(/of 200 vehicles/)).toBeInTheDocument()
    const countText = screen.getByText(/\d+ of 200 vehicles/)
    expect(countText.textContent).not.toBe('200 of 200 vehicles')
  })

  it('shows empty state when no vehicles match', async () => {
    const user = userEvent.setup()
    renderPage()

    const searchInput = screen.getByPlaceholderText(/Search by make/i)
    await user.type(searchInput, 'ZZZZNONEXISTENT')

    expect(screen.getByText('No vehicles match your filters.')).toBeInTheDocument()
  })

  it('shows clear filters button in empty state', async () => {
    const user = userEvent.setup()
    renderPage()

    const searchInput = screen.getByPlaceholderText(/Search by make/i)
    await user.type(searchInput, 'ZZZZNONEXISTENT')

    expect(screen.getByText('Clear all filters')).toBeInTheDocument()
  })

  it('clears filters when reset is clicked in empty state', async () => {
    const user = userEvent.setup()
    renderPage()

    const searchInput = screen.getByPlaceholderText(/Search by make/i)
    await user.type(searchInput, 'ZZZZNONEXISTENT')

    await user.click(screen.getByText('Clear all filters'))
    expect(screen.getByText('200 of 200 vehicles')).toBeInTheDocument()
  })

  it('renders filter dropdowns', () => {
    renderPage()
    expect(screen.getByLabelText(/Make/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Body Style/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Province/i)).toBeInTheDocument()
  })

  it('filters by make dropdown', async () => {
    const user = userEvent.setup()
    renderPage()

    const makeSelect = screen.getByLabelText(/Make/i)
    await user.selectOptions(makeSelect, 'Ford')

    const countText = screen.getByText(/\d+ of 200 vehicles/)
    expect(countText.textContent).not.toBe('200 of 200 vehicles')
  })
})
