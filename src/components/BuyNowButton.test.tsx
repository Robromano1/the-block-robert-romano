import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BuyNowButton } from './BuyNowButton'

function renderButton(price = 33500, onBuyNow = vi.fn()) {
  return { ...render(<BuyNowButton price={price} onBuyNow={onBuyNow} />), onBuyNow }
}

describe('BuyNowButton', () => {
  it('renders the buy now button with price', () => {
    renderButton(33500)
    expect(screen.getByRole('button', { name: /buy now/i })).toBeInTheDocument()
    expect(screen.getByText(/\$33,500/)).toBeInTheDocument()
  })

  it('transitions to confirmation state on click', async () => {
    const user = userEvent.setup()
    renderButton(33500)

    await user.click(screen.getByRole('button', { name: /buy now/i }))

    expect(screen.getByText(/purchase this vehicle/i)).toBeInTheDocument()
    expect(screen.getByText(/\$33,500/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirm purchase/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('calls onBuyNow when confirmed', async () => {
    const user = userEvent.setup()
    const { onBuyNow } = renderButton(33500)

    await user.click(screen.getByRole('button', { name: /buy now/i }))
    await user.click(screen.getByRole('button', { name: /confirm purchase/i }))

    expect(onBuyNow).toHaveBeenCalledOnce()
  })

  it('does not call onBuyNow without confirmation', async () => {
    const user = userEvent.setup()
    const { onBuyNow } = renderButton(33500)

    await user.click(screen.getByRole('button', { name: /buy now/i }))

    expect(onBuyNow).not.toHaveBeenCalled()
  })

  it('returns to initial state when cancel is clicked', async () => {
    const user = userEvent.setup()
    const { onBuyNow } = renderButton(33500)

    await user.click(screen.getByRole('button', { name: /buy now/i }))
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.getByRole('button', { name: /buy now/i })).toBeInTheDocument()
    expect(onBuyNow).not.toHaveBeenCalled()
  })

  it('shows success state after confirmation', async () => {
    const user = userEvent.setup()
    renderButton(33500)

    await user.click(screen.getByRole('button', { name: /buy now/i }))
    await user.click(screen.getByRole('button', { name: /confirm purchase/i }))

    expect(screen.getByText(/purchase complete/i)).toBeInTheDocument()
  })
})
