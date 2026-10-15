import { createContext, useContext, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig } from 'wagmi'
import { baseSepolia } from 'viem/chains'
import {
  AuthProvider as OpenfortAuthProviderEnum,
  OpenfortProvider,
  useSignOut,
  useUI,
  useUser,
} from '@openfort/react'
import { getDefaultConfig } from '@openfort/react/wagmi'
import { useEthereumEmbeddedWallet } from '@openfort/react/ethereum'

export const hasOpenfortKeys = Boolean(
  import.meta.env.VITE_OPENFORT_PUBLISHABLE_KEY && import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY,
)

const AuthContext = createContext(null)
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth fuera de AuthProvider')
  return ctx
}

const DEMO_KEY = 'peetoo_demo_user'

// ---------------- Modo demo (sin keys): login simulado en localStorage ----------------
export function DemoAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DEMO_KEY)) || null } catch { return null }
  })
  const [loginOpen, setLoginOpen] = useState(false)

  const loginDemo = ({ method, email, walletAddress, name }) => {
    const addr = walletAddress || `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`
    const next = {
      id: `demo-${Date.now()}`,
      name: name || (email ? email.split('@')[0] : 'Usuario demo'),
      email: email || '',
      method: method || 'demo',
      walletAddress: addr,
      location: 'La Habana',
    }
    setUser(next)
    localStorage.setItem(DEMO_KEY, JSON.stringify(next))
    setLoginOpen(false)
    return next
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(DEMO_KEY)
  }

  const value = useMemo(() => ({
    user,
    walletAddress: user?.walletAddress || null,
    isAuthenticated: Boolean(user),
    isDemo: true,
    hasOpenfortKeys: false,
    loginOpen,
    openLogin: () => setLoginOpen(true),
    closeLogin: () => setLoginOpen(false),
    loginDemo,
    logout,
    updateName: (name) => {
      setUser((u) => {
        if (!u) return u
        const next = { ...u, name }
        localStorage.setItem(DEMO_KEY, JSON.stringify(next))
        return next
      })
    },
  }), [user, loginOpen])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ---------------- Modo real: OpenFort ----------------
function RealAuthInner({ children }) {
  const { user: ofUser, isAuthenticated } = useUser()
  const { signOut } = useSignOut()
  const ui = useUI()
  const eth = useEthereumEmbeddedWallet()
  const [loginOpen, setLoginOpen] = useState(false)

  const user = useMemo(() => {
    if (!isAuthenticated || !ofUser) return null
    return {
      id: ofUser.id,
      name: ofUser.email ? ofUser.email.split('@')[0] : 'Usuario',
      email: ofUser.email || '',
      method: 'openfort',
      walletAddress: eth?.address || null,
      location: 'La Habana',
    }
  }, [isAuthenticated, ofUser, eth?.address])

  const value = useMemo(() => ({
    user,
    walletAddress: user?.walletAddress || null,
    isAuthenticated: Boolean(user),
    isDemo: false,
    hasOpenfortKeys: true,
    loginOpen,
    openLogin: () => { try { ui.open() } catch { setLoginOpen(true) } },
    closeLogin: () => { try { ui.close() } catch {} setLoginOpen(false) },
    loginDemo: null,
    logout: async () => { try { await signOut() } catch {} },
    updateName: () => {},
  }), [user, loginOpen, ui, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const queryClient = new QueryClient()
let wagmiConfig = null
function getWagmiConfig() {
  if (!wagmiConfig) {
    wagmiConfig = createConfig(getDefaultConfig({ appName: 'peetoo', chains: [baseSepolia] }))
  }
  return wagmiConfig
}

export function OpenfortProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={getWagmiConfig()}>
        <OpenfortProvider
          publishableKey={import.meta.env.VITE_OPENFORT_PUBLISHABLE_KEY}
          uiConfig={{
            appName: 'peetoo',
            authProviders: [
              OpenfortAuthProviderEnum.GOOGLE,
              OpenfortAuthProviderEnum.EMAIL_OTP,
              OpenfortAuthProviderEnum.WALLET,
            ],
          }}
          walletConfig={{
            shieldPublishableKey: import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY,
            ethereum: { chainId: 84532 },
          }}
        >
          <RealAuthInner>{children}</RealAuthInner>
        </OpenfortProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}

// Selector: App usa OpenfortProviders cuando hay keys, si no DemoAuthProvider.
export function AuthRoot({ children }) {
  if (hasOpenfortKeys) return <OpenfortProviders>{children}</OpenfortProviders>
  return <DemoAuthProvider>{children}</DemoAuthProvider>
}
