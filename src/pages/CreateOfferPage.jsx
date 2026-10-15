import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CHAINS, FIATS, PAYMENT_METHODS, STABLECOINS } from '../config/stablecoins'
import { useStore } from '../lib/store'
import { useAuth } from '../lib/auth'

export default function CreateOfferPage() {
  const { createOffer } = useStore()
  const { isAuthenticated, openLogin } = useAuth()
  const navigate = useNavigate()
  const [side, setSide] = useState('sell_crypto')
  const [crypto, setCrypto] = useState('USDC')
  const [fiat, setFiat] = useState('CUP')
  const [method, setMethod] = useState(PAYMENT_METHODS[0])
  const [chain, setChain] = useState(84532)
  const [price, setPrice] = useState('')
  const [available, setAvailable] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!isAuthenticated) { openLogin(); return }
    const p = Number(price), av = Number(available), mn = Number(minAmount), mx = Number(maxAmount)
    if (![p, av, mn, mx].every((n) => Number.isFinite(n) && n > 0)) { setError('Precio, disponible, mínimo y máximo deben ser mayores que 0.'); return }
    if (mn > mx) { setError('El mínimo no puede ser mayor que el máximo.'); return }
    if (mx > av) { setError('El máximo no puede superar lo disponible.'); return }
    const chainObj = CHAINS.find((c) => c.id === Number(chain))
    createOffer({ side, crypto, fiat, payment_method: method, chain: Number(chain), chain_name: chainObj?.name || 'Base Sepolia', price: p, available: av, min_amount: mn, max_amount: mx })
    navigate('/mis-ofertas')
  }

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <h1>Crear oferta</h1>
      <p className="muted">Una oferta = una crypto + una moneda fíat + un único método de pago + una red.</p>
      <form className="card" onSubmit={submit}>
        <label>¿Qué quieres hacer como maker?</label>
        <div className="tabs" style={{ margin: 0 }}>
          <button type="button" className={`tab ${side === 'sell_crypto' ? 'active' : ''}`} onClick={() => setSide('sell_crypto')}>Vender crypto</button>
          <button type="button" className={`tab ${side === 'buy_crypto' ? 'active' : ''}`} onClick={() => setSide('buy_crypto')}>Comprar crypto</button>
        </div>
        <label>Crypto</label>
        <select value={crypto} onChange={(e) => setCrypto(e.target.value)}>{STABLECOINS.map((s) => <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name}</option>)}</select>
        <label>Moneda fíat</label>
        <select value={fiat} onChange={(e) => setFiat(e.target.value)}>{FIATS.map((f) => <option key={f} value={f}>{f}</option>)}</select>
        <label>Método de pago (uno solo)</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>{PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}</select>
        <label>Red</label>
        <select value={chain} onChange={(e) => setChain(e.target.value)}>{CHAINS.map((c) => <option key={c.id} value={c.id}>{c.name}{c.testnet ? ' (testnet)' : ''}</option>)}</select>
        <label>Precio ({fiat} por 1 {crypto})</label>
        <input type="number" step="any" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ej. 1.08" />
        <label>Disponible ({crypto})</label>
        <input type="number" step="any" min="0" value={available} onChange={(e) => setAvailable(e.target.value)} placeholder="Ej. 500" />
        <label>Mínimo por orden ({crypto})</label>
        <input type="number" step="any" min="0" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder="Ej. 10" />
        <label>Máximo por orden ({crypto})</label>
        <input type="number" step="any" min="0" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} placeholder="Ej. 100" />
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} type="submit">Publicar oferta</button>
        <p className="note" style={{ marginTop: 12 }}>MVP: la oferta se guarda en Supabase cuando hay keys, si no en tu navegador. No bloquea fondos reales.</p>
      </form>
    </div>
  )
}
