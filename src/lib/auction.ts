import vehicleData from '../../data/vehicles.json'

export type AuctionStatus = 'upcoming' | 'live' | 'ended'

const AUCTION_DURATION_MS = 24 * 60 * 60 * 1000

const timeOffset = calculateTimeOffset()

function calculateTimeOffset(): number {
  const starts = vehicleData.map((v) => new Date(v.auction_start).getTime())
  const earliest = Math.min(...starts)
  const latest = Math.max(...starts)
  const midpoint = earliest + (latest - earliest) / 2
  return Date.now() - midpoint
}

export function normalizeAuctionStart(auctionStart: string): Date {
  return new Date(new Date(auctionStart).getTime() + timeOffset)
}

export function getAuctionStatus(auctionStart: string): AuctionStatus {
  const start = normalizeAuctionStart(auctionStart)
  const now = Date.now()
  const end = start.getTime() + AUCTION_DURATION_MS

  if (now < start.getTime()) return 'upcoming'
  if (now < end) return 'live'
  return 'ended'
}

export function getAuctionEnd(auctionStart: string): Date {
  const start = normalizeAuctionStart(auctionStart)
  return new Date(start.getTime() + AUCTION_DURATION_MS)
}

export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
}

export function getTimeRemaining(targetDate: Date): TimeRemaining {
  const totalMs = Math.max(0, targetDate.getTime() - Date.now())
  const totalSeconds = Math.floor(totalMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds, totalMs }
}

export function formatTimeRemaining(remaining: TimeRemaining): string {
  const { days, hours, minutes, seconds } = remaining
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}
