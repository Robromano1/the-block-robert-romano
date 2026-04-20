import type { VehicleFilters, SortOption } from '@/types/vehicle'

interface FilterPanelProps {
  filters: VehicleFilters
  makes: string[]
  bodyStyles: string[]
  provinces: string[]
  onFilterChange: <K extends keyof VehicleFilters>(key: K, value: VehicleFilters[K]) => void
  onReset: () => void
  hasActiveFilters: boolean
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'lot', label: 'Lot Number' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Year: Newest' },
  { value: 'year-asc', label: 'Year: Oldest' },
]

function SelectFilter({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export function FilterPanel({
  filters,
  makes,
  bodyStyles,
  provinces,
  onFilterChange,
  onReset,
  hasActiveFilters,
}: FilterPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <SelectFilter
        id="filter-make"
        label="Make"
        value={filters.make}
        options={makes}
        onChange={(v) => onFilterChange('make', v)}
      />
      <SelectFilter
        id="filter-body-style"
        label="Body Style"
        value={filters.bodyStyle}
        options={bodyStyles}
        onChange={(v) => onFilterChange('bodyStyle', v)}
      />
      <SelectFilter
        id="filter-province"
        label="Province"
        value={filters.province}
        options={provinces}
        onChange={(v) => onFilterChange('province', v)}
      />
      <div>
        <label htmlFor="filter-price-min" className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
        <input
          id="filter-price-min"
          type="number"
          placeholder="$0"
          value={filters.priceMin}
          onChange={(e) => onFilterChange('priceMin', e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="filter-price-max" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
        <input
          id="filter-price-max"
          type="number"
          placeholder="No max"
          value={filters.priceMax}
          onChange={(e) => onFilterChange('priceMax', e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="filter-sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
        <div className="flex gap-2">
          <select
            id="filter-sort"
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value as SortOption)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
