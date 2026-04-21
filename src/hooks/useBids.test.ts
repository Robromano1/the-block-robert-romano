import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBids, validateBid, getMinimumBid } from './useBids'

const mockStorage: Record<string, string> = {}

beforeEach(() => {
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key])
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => mockStorage[key] ?? null)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
    mockStorage[key] = value
  })
})

describe('validateBid', () => {
  it('returns valid for amount above minimum', () => {
    const result = validateBid(16100, 16000)
    expect(result.isValid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('returns valid for amount exactly at minimum increment', () => {
    const result = validateBid(16100, 16000)
    expect(result.isValid).toBe(true)
  })

  it('rejects amount below minimum increment', () => {
    const result = validateBid(16050, 16000)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('$16,100')
  })

  it('rejects amount equal to current bid', () => {
    const result = validateBid(16000, 16000)
    expect(result.isValid).toBe(false)
  })

  it('rejects zero', () => {
    const result = validateBid(0, 16000)
    expect(result.isValid).toBe(false)
  })

  it('rejects negative numbers', () => {
    const result = validateBid(-100, 16000)
    expect(result.isValid).toBe(false)
  })

  it('rejects NaN', () => {
    const result = validateBid(NaN, 16000)
    expect(result.isValid).toBe(false)
  })

  it('rejects Infinity', () => {
    const result = validateBid(Infinity, 16000)
    expect(result.isValid).toBe(false)
  })
})

describe('getMinimumBid', () => {
  it('returns current highest plus $100', () => {
    expect(getMinimumBid(16000)).toBe(16100)
  })

  it('works with zero', () => {
    expect(getMinimumBid(0)).toBe(100)
  })
})

describe('useBids', () => {
  it('starts with empty bids', () => {
    const { result } = renderHook(() => useBids())
    expect(result.current.bids).toEqual({})
  })

  it('places a bid and stores it', () => {
    const { result } = renderHook(() => useBids())

    act(() => {
      result.current.placeBid('vehicle-1', 20000)
    })

    const bid = result.current.getBidForVehicle('vehicle-1')
    expect(bid).toBeDefined()
    expect(bid!.amount).toBe(20000)
    expect(bid!.vehicleId).toBe('vehicle-1')
    expect(bid!.timestamp).toBeTruthy()
  })

  it('persists bids to localStorage', () => {
    const { result } = renderHook(() => useBids())

    act(() => {
      result.current.placeBid('vehicle-1', 20000)
    })

    expect(mockStorage['the-block-bids']).toBeDefined()
    const stored = JSON.parse(mockStorage['the-block-bids'])
    expect(stored['vehicle-1'].amount).toBe(20000)
  })

  it('loads bids from localStorage on mount', () => {
    mockStorage['the-block-bids'] = JSON.stringify({
      'vehicle-1': { vehicleId: 'vehicle-1', amount: 18000, timestamp: '2026-04-20T00:00:00Z' },
    })

    const { result } = renderHook(() => useBids())
    const bid = result.current.getBidForVehicle('vehicle-1')
    expect(bid).toBeDefined()
    expect(bid!.amount).toBe(18000)
  })

  it('overwrites previous bid for same vehicle', () => {
    const { result } = renderHook(() => useBids())

    act(() => {
      result.current.placeBid('vehicle-1', 20000)
    })
    act(() => {
      result.current.placeBid('vehicle-1', 22000)
    })

    const bid = result.current.getBidForVehicle('vehicle-1')
    expect(bid!.amount).toBe(22000)
  })

  it('returns undefined for vehicle with no bid', () => {
    const { result } = renderHook(() => useBids())
    expect(result.current.getBidForVehicle('no-bid')).toBeUndefined()
  })

  describe('getEffectiveBid', () => {
    it('returns data bid when no user bid exists', () => {
      const { result } = renderHook(() => useBids())
      expect(result.current.getEffectiveBid('v1', 15000, 10000)).toBe(15000)
    })

    it('returns starting bid when current_bid is null and no user bid', () => {
      const { result } = renderHook(() => useBids())
      expect(result.current.getEffectiveBid('v1', null, 10000)).toBe(10000)
    })

    it('returns user bid when it exceeds data bid', () => {
      const { result } = renderHook(() => useBids())
      act(() => {
        result.current.placeBid('v1', 20000)
      })
      expect(result.current.getEffectiveBid('v1', 15000, 10000)).toBe(20000)
    })

    it('returns data bid when it exceeds user bid', () => {
      const { result } = renderHook(() => useBids())
      act(() => {
        result.current.placeBid('v1', 12000)
      })
      expect(result.current.getEffectiveBid('v1', 15000, 10000)).toBe(15000)
    })
  })

  describe('getEffectiveBidCount', () => {
    it('returns data count when no user bid', () => {
      const { result } = renderHook(() => useBids())
      expect(result.current.getEffectiveBidCount('v1', 5)).toBe(5)
    })

    it('returns data count + 1 when user has bid', () => {
      const { result } = renderHook(() => useBids())
      act(() => {
        result.current.placeBid('v1', 20000)
      })
      expect(result.current.getEffectiveBidCount('v1', 5)).toBe(6)
    })
  })
})
