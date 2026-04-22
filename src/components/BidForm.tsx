import { useState } from 'react'
import { validateBid, getMinimumBid } from '@/hooks/useBids'
import { formatCurrency } from '@/lib/format'

interface BidFormProps {
  currentHighest: number
  onPlaceBid: (amount: number) => void
}

type FormState = 'input' | 'confirm' | 'success'

function parseBidInput(input: string): number {
  const stripped = input.replace(/[^0-9.]/g, '')
  const [whole, decimal] = stripped.split('.')
  const normalized = decimal !== undefined ? `${whole}.${decimal}` : whole
  return Number(normalized)
}

export function BidForm({ currentHighest, onPlaceBid }: BidFormProps) {
  const [bidInput, setBidInput] = useState(getMinimumBid(currentHighest).toString())
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<FormState>('input')

  const minimumBid = getMinimumBid(currentHighest)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const amount = parseBidInput(bidInput)
    const validation = validateBid(amount, currentHighest)

    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    setFormState('confirm')
  }

  function handleConfirm() {
    const amount = parseBidInput(bidInput)
    onPlaceBid(amount)
    setFormState('success')
    setBidInput(getMinimumBid(amount).toString())
  }

  function handleCancel() {
    setFormState('input')
  }

  function handleNewBid() {
    setFormState('input')
    setError(null)
  }

  if (formState === 'success') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="font-medium text-green-800">Bid placed successfully!</p>
        </div>
        <button
          onClick={handleNewBid}
          className="mt-3 text-sm text-green-700 hover:text-green-900 font-medium"
        >
          Place another bid
        </button>
      </div>
    )
  }

  if (formState === 'confirm') {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-sm text-blue-800">
          Confirm your bid of <span className="font-bold">{formatCurrency(parseBidInput(bidInput))}</span>?
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleConfirm}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Confirm Bid
          </button>
          <button
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-gray-900">Place a Bid</h2>
      <p className="mt-1 text-sm text-gray-500">
        Minimum bid: {formatCurrency(minimumBid)}
      </p>
      <div className="mt-3">
        <label htmlFor="bid-amount" className="sr-only">Bid amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            id="bid-amount"
            type="text"
            inputMode="decimal"
            value={bidInput}
            onChange={(e) => {
              setBidInput(e.target.value)
              setError(null)
            }}
            placeholder={minimumBid.toLocaleString()}
            className="w-full rounded-lg border border-gray-300 py-3 pl-7 pr-4 text-base sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
      <button
        type="submit"
        className="mt-3 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
      >
        Review Bid
      </button>
    </form>
  )
}
