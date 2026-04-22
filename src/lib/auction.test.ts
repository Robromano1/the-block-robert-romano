import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../data/vehicles.json', () => ({
  default: [
    { auction_start: '2026-04-01T10:00:00Z' },
    { auction_start: '2026-04-03T10:00:00Z' },
  ],
}))

import {
  getAuctionStatus,
  getAuctionEnd,
  normalizeAuctionStart,
  getTimeRemaining,
  formatTimeRemaining,
  type TimeRemaining,
} from './auction'

const AUCTION_DURATION_MS = 24 * 60 * 60 * 1000

describe('normalizeAuctionStart', () => {
  it('returns a Date object', () => {
    const result = normalizeAuctionStart('2026-04-01T10:00:00Z')
    expect(result).toBeInstanceOf(Date)
  })

  it('shifts the date by the computed time offset', () => {
    const result = normalizeAuctionStart('2026-04-02T10:00:00Z')
    const diff = Math.abs(result.getTime() - Date.now())
    expect(diff).toBeLessThan(2 * 24 * 60 * 60 * 1000)
  })
})

describe('getAuctionStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "upcoming" when now is before the normalized start', () => {
    const normalizedStart = normalizeAuctionStart('2026-04-03T10:00:00Z')
    vi.setSystemTime(new Date(normalizedStart.getTime() - 60_000))
    expect(getAuctionStatus('2026-04-03T10:00:00Z')).toBe('upcoming')
  })

  it('returns "live" when now is after start but before end', () => {
    const normalizedStart = normalizeAuctionStart('2026-04-02T10:00:00Z')
    vi.setSystemTime(new Date(normalizedStart.getTime() + 60_000))
    expect(getAuctionStatus('2026-04-02T10:00:00Z')).toBe('live')
  })

  it('returns "ended" when now is after start + 24 hours', () => {
    const normalizedStart = normalizeAuctionStart('2026-04-01T10:00:00Z')
    vi.setSystemTime(new Date(normalizedStart.getTime() + AUCTION_DURATION_MS + 60_000))
    expect(getAuctionStatus('2026-04-01T10:00:00Z')).toBe('ended')
  })

  it('returns "live" at exactly the start time', () => {
    const normalizedStart = normalizeAuctionStart('2026-04-02T10:00:00Z')
    vi.setSystemTime(normalizedStart)
    expect(getAuctionStatus('2026-04-02T10:00:00Z')).toBe('live')
  })

  it('returns "ended" at exactly the end time', () => {
    const normalizedStart = normalizeAuctionStart('2026-04-02T10:00:00Z')
    vi.setSystemTime(new Date(normalizedStart.getTime() + AUCTION_DURATION_MS))
    expect(getAuctionStatus('2026-04-02T10:00:00Z')).toBe('ended')
  })
})

describe('getAuctionEnd', () => {
  it('returns normalized start + 24 hours', () => {
    const start = normalizeAuctionStart('2026-04-02T10:00:00Z')
    const end = getAuctionEnd('2026-04-02T10:00:00Z')
    expect(end.getTime()).toBe(start.getTime() + AUCTION_DURATION_MS)
  })

  it('returns a Date object', () => {
    expect(getAuctionEnd('2026-04-02T10:00:00Z')).toBeInstanceOf(Date)
  })
})

describe('getTimeRemaining', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns zero when target is in the past', () => {
    vi.setSystemTime(new Date('2026-04-05T00:00:00Z'))
    const result = getTimeRemaining(new Date('2026-04-04T00:00:00Z'))
    expect(result.totalMs).toBe(0)
    expect(result.days).toBe(0)
    expect(result.hours).toBe(0)
    expect(result.minutes).toBe(0)
    expect(result.seconds).toBe(0)
  })

  it('returns zero when target is exactly now', () => {
    const now = new Date('2026-04-05T00:00:00Z')
    vi.setSystemTime(now)
    const result = getTimeRemaining(now)
    expect(result.totalMs).toBe(0)
  })

  it('correctly decomposes 1 day, 2 hours, 3 minutes, 4 seconds', () => {
    vi.setSystemTime(new Date('2026-04-05T00:00:00Z'))
    const target = new Date('2026-04-06T02:03:04Z')
    const result = getTimeRemaining(target)
    expect(result.days).toBe(1)
    expect(result.hours).toBe(2)
    expect(result.minutes).toBe(3)
    expect(result.seconds).toBe(4)
    expect(result.totalMs).toBe(((26 * 60 + 3) * 60 + 4) * 1000)
  })

  it('handles sub-day durations', () => {
    vi.setSystemTime(new Date('2026-04-05T00:00:00Z'))
    const target = new Date('2026-04-05T05:30:15Z')
    const result = getTimeRemaining(target)
    expect(result.days).toBe(0)
    expect(result.hours).toBe(5)
    expect(result.minutes).toBe(30)
    expect(result.seconds).toBe(15)
  })

  it('never returns negative values', () => {
    vi.setSystemTime(new Date('2026-04-10T00:00:00Z'))
    const result = getTimeRemaining(new Date('2026-04-01T00:00:00Z'))
    expect(result.totalMs).toBeGreaterThanOrEqual(0)
    expect(result.days).toBeGreaterThanOrEqual(0)
    expect(result.hours).toBeGreaterThanOrEqual(0)
    expect(result.minutes).toBeGreaterThanOrEqual(0)
    expect(result.seconds).toBeGreaterThanOrEqual(0)
  })
})

describe('formatTimeRemaining', () => {
  it('shows days, hours, minutes when days > 0', () => {
    const remaining: TimeRemaining = { days: 2, hours: 5, minutes: 30, seconds: 15, totalMs: 1 }
    expect(formatTimeRemaining(remaining)).toBe('2d 5h 30m')
  })

  it('shows hours, minutes, seconds when hours > 0 but no days', () => {
    const remaining: TimeRemaining = { days: 0, hours: 3, minutes: 15, seconds: 42, totalMs: 1 }
    expect(formatTimeRemaining(remaining)).toBe('3h 15m 42s')
  })

  it('shows minutes and seconds when only minutes remain', () => {
    const remaining: TimeRemaining = { days: 0, hours: 0, minutes: 8, seconds: 30, totalMs: 1 }
    expect(formatTimeRemaining(remaining)).toBe('8m 30s')
  })

  it('shows only seconds when under a minute', () => {
    const remaining: TimeRemaining = { days: 0, hours: 0, minutes: 0, seconds: 45, totalMs: 1 }
    expect(formatTimeRemaining(remaining)).toBe('45s')
  })

  it('shows 0s when all components are zero', () => {
    const remaining: TimeRemaining = { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 }
    expect(formatTimeRemaining(remaining)).toBe('0s')
  })

  it('shows 1d 0h 0m for exactly one day', () => {
    const remaining: TimeRemaining = { days: 1, hours: 0, minutes: 0, seconds: 0, totalMs: 1 }
    expect(formatTimeRemaining(remaining)).toBe('1d 0h 0m')
  })
})
