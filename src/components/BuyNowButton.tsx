import { useState } from 'react'
import { formatCurrency } from '@/lib/format'

interface BuyNowButtonProps {
  price: number
  onBuyNow: () => void
}

type BuyNowState = 'idle' | 'confirm' | 'success'

export function BuyNowButton({ price, onBuyNow }: BuyNowButtonProps) {
  const [state, setState] = useState<BuyNowState>('idle')

  if (state === 'success') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="font-medium text-green-800">Purchase complete!</p>
        </div>
        <p className="mt-1 text-sm text-green-700">
          You purchased this vehicle for {formatCurrency(price)}.
        </p>
      </div>
    )
  }

  if (state === 'confirm') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm text-amber-800">
          Purchase this vehicle now for <span className="font-bold">{formatCurrency(price)}</span>?
        </p>
        <p className="mt-1 text-xs text-amber-600">This skips the auction and buys immediately.</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => {
              onBuyNow()
              setState('success')
            }}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition"
          >
            Confirm Purchase
          </button>
          <button
            onClick={() => setState('idle')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setState('confirm')}
      className="w-full rounded-lg border-2 border-amber-500 bg-amber-50 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100 transition"
    >
      Buy Now for {formatCurrency(price)}
    </button>
  )
}
