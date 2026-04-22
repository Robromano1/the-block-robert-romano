import {
  getAuctionStatus,
  getAuctionEnd,
  normalizeAuctionStart,
  formatTimeRemaining,
  type AuctionStatus,
} from '@/lib/auction'
import { useCountdown } from '@/hooks/useCountdown'

interface AuctionBadgeProps {
  auctionStart: string
  variant?: 'compact' | 'full'
}

const STATUS_STYLES: Record<AuctionStatus, string> = {
  upcoming: 'bg-blue-100 text-blue-800',
  live: 'bg-green-100 text-green-800',
  ended: 'bg-gray-100 text-gray-500',
}

const STATUS_LABELS: Record<AuctionStatus, string> = {
  upcoming: 'Upcoming',
  live: 'Live',
  ended: 'Ended',
}

function CountdownDisplay({ targetDate, prefix }: { targetDate: Date; prefix: string }) {
  const remaining = useCountdown(targetDate)
  if (remaining.totalMs <= 0) return null
  return <span>{prefix}{formatTimeRemaining(remaining)}</span>
}

export function AuctionBadge({ auctionStart, variant = 'compact' }: AuctionBadgeProps) {
  const status = getAuctionStatus(auctionStart)

  if (variant === 'compact') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
        {status === 'live' && <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />}
        {STATUS_LABELS[status]}
      </span>
    )
  }

  const targetDate = status === 'upcoming'
    ? normalizeAuctionStart(auctionStart)
    : getAuctionEnd(auctionStart)

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[status]}`}>
      {status === 'live' && <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
      <span>{STATUS_LABELS[status]}</span>
      {status === 'upcoming' && (
        <CountdownDisplay targetDate={targetDate} prefix="· Starts in " />
      )}
      {status === 'live' && (
        <CountdownDisplay targetDate={targetDate} prefix="· Ends in " />
      )}
    </div>
  )
}
