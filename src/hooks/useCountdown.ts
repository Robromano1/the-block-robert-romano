import { useState, useEffect } from 'react'
import { getTimeRemaining, type TimeRemaining } from '@/lib/auction'

export function useCountdown(targetDate: Date): TimeRemaining {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(targetDate))

  useEffect(() => {
    if (remaining.totalMs <= 0) return

    const interval = setInterval(() => {
      const next = getTimeRemaining(targetDate)
      setRemaining(next)
      if (next.totalMs <= 0) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate, remaining.totalMs])

  return remaining
}
