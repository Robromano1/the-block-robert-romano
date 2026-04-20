import { useVehicles } from '@/hooks/useVehicles'
import { useVehicleFilters } from '@/hooks/useVehicleFilters'
import { SearchBar } from '@/components/SearchBar'
import { FilterPanel } from '@/components/FilterPanel'
import { VehicleCard } from '@/components/VehicleCard'

export function InventoryPage() {
  const { vehicles, makes, bodyStyles, provinces } = useVehicles()
  const { filters, filteredVehicles, updateFilter, resetFilters, hasActiveFilters } =
    useVehicleFilters(vehicles)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">The Block</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredVehicles.length} of {vehicles.length} vehicles
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <SearchBar value={filters.search} onChange={(v) => updateFilter('search', v)} />
          <FilterPanel
            filters={filters}
            makes={makes}
            bodyStyles={bodyStyles}
            provinces={provinces}
            onFilterChange={updateFilter}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-gray-500">No vehicles match your filters.</p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
