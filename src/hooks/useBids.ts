import { useState, useCallback } from 'react'
import type { Bid, BidState } from '@/types/bid'

const STORAGE_KEY = 'the-block-bids'
const MINIMUM_INCREMENT = 100

function loadBidsFromStorage(): BidState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    return JSON.parse(stored) as BidState
  } catch {
    return {}
  }
}

function saveBidsToStorage(bids: BidState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bids))
}

export interface BidValidation {
  isValid: boolean
  error: string | null
}

export function validateBid(amount: number, currentHighest: number): BidValidation {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { isValid: false, error: 'Please enter a valid bid amount.' }
  }

  const minimumBid = currentHighest + MINIMUM_INCREMENT

  if (amount < minimumBid) {
    return {
      isValid: false,
      error: `Bid must be at least $${minimumBid.toLocaleString()} ($${MINIMUM_INCREMENT} above current bid).`,
    }
  }

  return { isValid: true, error: null }
}

export function getMinimumBid(currentHighest: number): number {
  return currentHighest + MINIMUM_INCREMENT
}

export function useBids() {
  const [bids, setBids] = useState<BidState>(loadBidsFromStorage)

  const placeBid = useCallback((vehicleId: string, amount: number): Bid => {
    const bid: Bid = {
      vehicleId,
      amount,
      timestamp: new Date().toISOString(),
    }

    setBids((prev) => {
      const next = { ...prev, [vehicleId]: bid }
      saveBidsToStorage(next)
      return next
    })

    return bid
  }, [])

  const getBidForVehicle = useCallback(
    (vehicleId: string): Bid | undefined => bids[vehicleId],
    [bids],
  )

  const getEffectiveBid = useCallback(
    (vehicleId: string, dataCurrentBid: number | null, dataStartingBid: number): number => {
      const userBid = bids[vehicleId]
      const dataBid = dataCurrentBid ?? dataStartingBid
      if (!userBid) return dataBid
      return Math.max(userBid.amount, dataBid)
    },
    [bids],
  )

  const getEffectiveBidCount = useCallback(
    (vehicleId: string, dataBidCount: number): number => {
      const userBid = bids[vehicleId]
      return userBid ? dataBidCount + 1 : dataBidCount
    },
    [bids],
  )

  return { bids, placeBid, getBidForVehicle, getEffectiveBid, getEffectiveBidCount }
}
