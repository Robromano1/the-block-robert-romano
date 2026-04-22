import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BidForm } from './BidForm'

function renderBidForm(currentHighest = 16000, onPlaceBid = vi.fn()) {
  return { ...render(<BidForm currentHighest={currentHighest} onPlaceBid={onPlaceBid} />), onPlaceBid }
}

describe('BidForm', () => {
  it('renders the form heading', () => {
    renderBidForm()
    expect(screen.getByText('Place a Bid')).toBeInTheDocument()
  })

  it('shows the minimum bid amount', () => {
    renderBidForm(16000)
    expect(screen.getByText(/\$16,100/)).toBeInTheDocument()
  })

  it('shows validation error for bid below minimum', async () => {
    renderBidForm(16000)

    const input = screen.getByLabelText(/bid amount/i)
    fireEvent.change(input, { target: { value: '16050' } })
    fireEvent.submit(input.closest('form')!)

    expect(screen.getByText(/Bid must be at least/)).toBeInTheDocument()
  })

  it('shows validation error for empty input', async () => {
    const user = userEvent.setup()
    renderBidForm(16000)

    const input = screen.getByLabelText(/bid amount/i)
    await user.clear(input)
    await user.click(screen.getByText('Review Bid'))

    expect(screen.getByText(/valid bid amount/)).toBeInTheDocument()
  })

  it('transitions to confirmation state for valid bid', async () => {
    const user = userEvent.setup()
    renderBidForm(16000)

    const input = screen.getByLabelText(/bid amount/i)
    await user.clear(input)
    await user.type(input, '17000')
    await user.click(screen.getByText('Review Bid'))

    expect(screen.getByText(/Confirm your bid of/)).toBeInTheDocument()
    expect(screen.getByText(/\$17,000/)).toBeInTheDocument()
  })

  it('calls onPlaceBid when confirmed', async () => {
    const user = userEvent.setup()
    const { onPlaceBid } = renderBidForm(16000)

    const input = screen.getByLabelText(/bid amount/i)
    await user.clear(input)
    await user.type(input, '17000')
    await user.click(screen.getByText('Review Bid'))
    await user.click(screen.getByText('Confirm Bid'))

    expect(onPlaceBid).toHaveBeenCalledWith(17000)
  })

  it('shows success state after confirmation', async () => {
    const user = userEvent.setup()
    renderBidForm(16000)

    const input = screen.getByLabelText(/bid amount/i)
    await user.clear(input)
    await user.type(input, '17000')
    await user.click(screen.getByText('Review Bid'))
    await user.click(screen.getByText('Confirm Bid'))

    expect(screen.getByText('Bid placed successfully!')).toBeInTheDocument()
  })

  it('returns to input state when cancel is clicked in confirmation', async () => {
    const user = userEvent.setup()
    const { onPlaceBid } = renderBidForm(16000)

    const input = screen.getByLabelText(/bid amount/i)
    await user.clear(input)
    await user.type(input, '17000')
    await user.click(screen.getByText('Review Bid'))
    await user.click(screen.getByText('Cancel'))

    expect(screen.getByText('Place a Bid')).toBeInTheDocument()
    expect(onPlaceBid).not.toHaveBeenCalled()
  })

  it('allows placing another bid after success', async () => {
    const user = userEvent.setup()
    renderBidForm(16000)

    const input = screen.getByLabelText(/bid amount/i)
    await user.clear(input)
    await user.type(input, '17000')
    await user.click(screen.getByText('Review Bid'))
    await user.click(screen.getByText('Confirm Bid'))
    await user.click(screen.getByText('Place another bid'))

    expect(screen.getByText('Place a Bid')).toBeInTheDocument()
  })

  it('does not call onPlaceBid without confirmation', async () => {
    const user = userEvent.setup()
    const { onPlaceBid } = renderBidForm(16000)

    const input = screen.getByLabelText(/bid amount/i)
    await user.clear(input)
    await user.type(input, '17000')
    await user.click(screen.getByText('Review Bid'))

    expect(onPlaceBid).not.toHaveBeenCalled()
  })

  it('pre-fills input with minimum bid amount', () => {
    renderBidForm(16000)
    const input = screen.getByLabelText(/bid amount/i) as HTMLInputElement
    expect(input.value).toBe('16100')
  })

  it('accepts comma-formatted input (e.g. 21,100)', async () => {
    const user = userEvent.setup()
    const { onPlaceBid } = renderBidForm(16000)

    const input = screen.getByLabelText(/bid amount/i)
    await user.clear(input)
    await user.type(input, '21,100')
    await user.click(screen.getByText('Review Bid'))

    expect(screen.getByText(/Confirm your bid of/)).toBeInTheDocument()
    await user.click(screen.getByText('Confirm Bid'))
    expect(onPlaceBid).toHaveBeenCalledWith(21100)
  })
})
