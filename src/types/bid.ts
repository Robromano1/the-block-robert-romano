export interface Bid {
  vehicleId: string
  amount: number
  timestamp: string
}

export interface BidState {
  [vehicleId: string]: Bid
}
