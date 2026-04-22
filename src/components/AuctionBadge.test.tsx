import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../../data/vehicles.json', () => ({
  default: [
    { auction_start: '2026-04-01T10:00:00Z' },
    { auction_start: '2026-04-03T10:00:00Z' },
  ],
}))

import { normalizeAuctionStart } from '@/lib/auction'
import { AuctionBadge } from './AuctionBadge'

const AUCTION_START = '2026-04-02T10:00:00Z'
const AUCTION_DURATION_MS = 24 * 60 * 60 * 1000

describe('AuctionBadge', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('compact variant (default)', () => {
    it('shows "Upcoming" for future auctions', () => {
      const start = normalizeAuctionStart(AUCTION_START)
      vi.setSystemTime(new Date(start.getTime() - 60_000))

      render(<AuctionBadge auctionStart={AUCTION_START} />)
      expect(screen.getByText('Upcoming')).toBeInTheDocument()
    })

    it('shows "Live" for active auctions', () => {
      const start = normalizeAuctionStart(AUCTION_START)
      vi.setSystemTime(new Date(start.getTime() + 60_000))

      render(<AuctionBadge auctionStart={AUCTION_START} />)
      expect(screen.getByText('Live')).toBeInTheDocument()
    })

    it('shows "Ended" for past auctions', () => {
      const start = normalizeAuctionStart(AUCTION_START)
      vi.setSystemTime(new Date(start.getTime() + AUCTION_DURATION_MS + 60_000))

      render(<AuctionBadge auctionStart={AUCTION_START} />)
      expect(screen.getByText('Ended')).toBeInTheDocument()
    })

    it('does not show countdown in compact mode', () => {
      const start = normalizeAuctionStart(AUCTION_START)
      vi.setSystemTime(new Date(start.getTime() + 60_000))

      render(<AuctionBadge auctionStart={AUCTION_START} />)
      expect(screen.queryByText(/Ends in/)).not.toBeInTheDocument()
      expect(screen.queryByText(/Starts in/)).not.toBeInTheDocument()
    })
  })

  describe('full variant', () => {
    it('shows countdown for upcoming auctions', () => {
      const start = normalizeAuctionStart(AUCTION_START)
      vi.setSystemTime(new Date(start.getTime() - 2 * 60 * 60 * 1000))

      render(<AuctionBadge auctionStart={AUCTION_START} variant="full" />)
      expect(screen.getByText('Upcoming')).toBeInTheDocument()
      expect(screen.getByText(/Starts in/)).toBeInTheDocument()
    })

    it('shows countdown for live auctions', () => {
      const start = normalizeAuctionStart(AUCTION_START)
      vi.setSystemTime(new Date(start.getTime() + 60_000))

      render(<AuctionBadge auctionStart={AUCTION_START} variant="full" />)
      expect(screen.getByText('Live')).toBeInTheDocument()
      expect(screen.getByText(/Ends in/)).toBeInTheDocument()
    })

    it('does not show countdown for ended auctions', () => {
      const start = normalizeAuctionStart(AUCTION_START)
      vi.setSystemTime(new Date(start.getTime() + AUCTION_DURATION_MS + 60_000))

      render(<AuctionBadge auctionStart={AUCTION_START} variant="full" />)
      expect(screen.getByText('Ended')).toBeInTheDocument()
      expect(screen.queryByText(/Ends in/)).not.toBeInTheDocument()
      expect(screen.queryByText(/Starts in/)).not.toBeInTheDocument()
    })
  })
})
