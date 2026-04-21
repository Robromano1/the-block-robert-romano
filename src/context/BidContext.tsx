import { createContext, useContext } from 'react'
import { useBids } from '@/hooks/useBids'

type BidContextValue = ReturnType<typeof useBids>

const BidContext = createContext<BidContextValue | null>(null)

export function BidProvider({ children }: { children: React.ReactNode }) {
  const bidState = useBids()
  return <BidContext.Provider value={bidState}>{children}</BidContext.Provider>
}

export function useBidContext(): BidContextValue {
  const context = useContext(BidContext)
  if (!context) {
    throw new Error('useBidContext must be used within a BidProvider')
  }
  return context
}
