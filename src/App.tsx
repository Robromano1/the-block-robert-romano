import { BrowserRouter, Routes, Route } from 'react-router'
import { BidProvider } from '@/context/BidContext'
import { InventoryPage } from '@/pages/InventoryPage'
import { VehicleDetailPage } from '@/pages/VehicleDetailPage'

export default function App() {
  return (
    <BidProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InventoryPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
        </Routes>
      </BrowserRouter>
    </BidProvider>
  )
}
