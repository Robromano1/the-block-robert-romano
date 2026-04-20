export interface Vehicle {
  id: string
  vin: string
  year: number
  make: string
  model: string
  trim: string
  body_style: string
  exterior_color: string
  interior_color: string
  engine: string
  transmission: string
  drivetrain: string
  odometer_km: number
  fuel_type: string
  condition_grade: number
  condition_report: string
  damage_notes: string[]
  title_status: string
  province: string
  city: string
  auction_start: string
  starting_bid: number
  reserve_price: number
  buy_now_price: number | null
  images: string[]
  selling_dealership: string
  lot: string
  current_bid: number | null
  bid_count: number
}

export type SortOption = 'lot' | 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc'

export interface VehicleFilters {
  search: string
  make: string
  bodyStyle: string
  province: string
  priceMin: string
  priceMax: string
  sort: SortOption
}
