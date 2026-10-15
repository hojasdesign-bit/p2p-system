import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import LoginModal from './components/LoginModal'
import MarketPage from './pages/MarketPage'
import CreateOfferPage from './pages/CreateOfferPage'
import MyOffersPage from './pages/MyOffersPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import ProfilePage from './pages/ProfilePage'
import MyProfilePage from './pages/MyProfilePage'
import { AuthRoot, hasOpenfortKeys } from './lib/auth'
import { StoreProvider } from './lib/store'

function Shell() {
  return (
    <>
      <Header />
      {!hasOpenfortKeys && (
        <div className="banner">Modo demo: sin keys de OpenFort / Supabase la app usa datos de ejemplo y login simulado. Configura las variables de entorno para el modo real.</div>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/p2p" replace />} />
        <Route path="/p2p" element={<MarketPage />} />
        <Route path="/crear-oferta" element={<CreateOfferPage />} />
        <Route path="/mis-ofertas" element={<MyOffersPage />} />
        <Route path="/ordenes" element={<OrdersPage />} />
        <Route path="/orden/:id" element={<OrderDetailPage />} />
        <Route path="/perfil/:id" element={<ProfilePage />} />
        <Route path="/mi-perfil" element={<MyProfilePage />} />
        <Route path="*" element={<Navigate to="/p2p" replace />} />
      </Routes>
      <LoginModal />
    </>
  )
}

export default function App() {
  return (
    <AuthRoot>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </AuthRoot>
  )
}
