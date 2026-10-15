import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { SEED_OFFERS } from '../data/seedOffers'
import { supabase, hasSupabase } from './supabase'
import { useAuth } from './auth'

const StoreContext = createContext(null)
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore fuera de StoreProvider')
  return ctx
}

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return fallback
}

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function StoreProvider({ children }) {
  const { user } = useAuth()
  const [offers, setOffers] = useState(() => loadLocal('peetoo_offers', SEED_OFFERS))
  const [orders, setOrders] = useState(() => loadLocal('peetoo_orders', []))
  const [loadedFromSupabase, setLoadedFromSupabase] = useState(false)

  // Supabase: si hay keys y hay filas, esas mandan. Si no, seed + localStorage.
  useEffect(() => {
    if (!hasSupabase || loadedFromSupabase) return
    let cancelled = false
    ;(async () => {
      try {
        const [o, ord] = await Promise.all([
          supabase.from('offers').select('*').order('created_at', { ascending: false }),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
        ])
        if (cancelled) return
        if (o.data && o.data.length > 0) {
          setOffers(o.data)
          localStorage.setItem('peetoo_offers', JSON.stringify(o.data))
        }
        if (ord.data && ord.data.length > 0) {
          setOrders(ord.data)
          localStorage.setItem('peetoo_orders', JSON.stringify(ord.data))
        }
        setLoadedFromSupabase(true)
      } catch { /* modo local */ }
    })()
    return () => { cancelled = true }
  }, [loadedFromSupabase])

  useEffect(() => { localStorage.setItem('peetoo_offers', JSON.stringify(offers)) }, [offers])
  useEffect(() => { localStorage.setItem('peetoo_orders', JSON.stringify(orders)) }, [orders])

  const persistOffer = async (offer) => {
    if (!hasSupabase) return
    try { await supabase.from('offers').upsert(offer) } catch {}
  }
  const persistOrder = async (order) => {
    if (!hasSupabase) return
    try { await supabase.from('orders').upsert(order) } catch {}
  }

  const createOffer = (input) => {
    const offer = {
      id: uid(),
      owner_id: user?.id || 'anon',
      owner_name: user?.name || 'Usuario',
      owner_location: user?.location || 'La Habana',
      owner_trades: 0,
      owner_score: 100,
      status: 'active',
      ...input,
    }
    setOffers((prev) => [offer, ...prev])
    persistOffer(offer)
    return offer
  }

  const updateOffer = (id, patch) => {
    setOffers((prev) => prev.map((o) => {
      if (o.id !== id) return o
      const next = { ...o, ...patch }
      persistOffer(next)
      return next
    }))
  }

  const createOrder = (offer, cryptoAmount) => {
    const amount = Number(cryptoAmount)
    const fiatAmount = Number((amount * Number(offer.price)).toFixed(2))
    const order = {
      id: uid(),
      offer_id: offer.id,
      maker_id: offer.owner_id,
      taker_id: user?.id || 'anon',
      taker_name: user?.name || 'Usuario',
      maker_name: offer.owner_name,
      side: offer.side,
      crypto: offer.crypto,
      fiat: offer.fiat,
      payment_method: offer.payment_method,
      crypto_amount: amount,
      fiat_amount: fiatAmount,
      price: Number(offer.price),
      status: 'pending_payment',
      proof: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setOrders((prev) => [order, ...prev])
    persistOrder(order)
    return order
  }

  const updateOrder = (id, patch) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o
      const next = { ...o, ...patch, updated_at: new Date().toISOString() }
      persistOrder(next)
      return next
    }))
  }

  const value = useMemo(() => ({
    offers, orders,
    getOffer: (id) => offers.find((o) => String(o.id) === String(id)),
    getOrder: (id) => orders.find((o) => String(o.id) === String(id)),
    myOffers: user ? offers.filter((o) => String(o.owner_id) === String(user.id)) : [],
    myOrders: user ? orders.filter((o) => String(o.maker_id) === String(user.id) || String(o.taker_id) === String(user.id)) : [],
    createOffer, updateOffer, createOrder, updateOrder,
    currentUserId: user?.id || null,
  }), [offers, orders, user])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
