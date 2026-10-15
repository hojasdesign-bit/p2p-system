import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FIATS, PAYMENT_METHODS, STABLECOINS } from '../config/stablecoins'
import { useStore } from '../lib/store'
import { useAuth } from '../lib/auth'
import OfferCard from '../components/OfferCard'

export default function MarketPage() {
  const { offers, createOrder } = useStore()
  const { isAuthenticated, openLogin } = useAuth()
  const navigate = useNavigate()
  // Perspectiva del taker: Comprar = yo compro crypto (ofertas sell_crypto).
  const [takerSide, setTakerSide] = useState('buy')
  const [crypto, setCrypto] = useState('')
  const [fiat, setFiat] = useState('')
  const [method, setMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const wantSide = takerSide === 'buy' ? 'sell_crypto' : 'buy_crypto'
    return offers.filter((o) => {
      if (o.status !== 'active') return false
      if (o.side !== wantSide) return false
      if (crypto && o.crypto !== crypto) return false
      if (fiat && o.fiat !== fiat) return false
      if (method && o.payment_method !== method) return false
      if (search && !o.owner_name.toLowerCase().includes(search.toLowerCase())) return false
      if (amount) {
        const a = Number(amount)
        if (!Number.isFinite(a) || a < Number(o.min_amount) || a > Number(o.max_amount) || a > Number(o.available)) return false
      }
      return true
    })
  }, [offers, takerSide, crypto, fiat, method, amount, search])

  const take = (offer, cryptoAmount) => {
    if (!isAuthenticated) { openLogin(); return }
    const order = createOrder(offer, cryptoAmount)
    navigate(`/orden/${order.id}`)
  }

  return (
    <div className="container">
      <div className="row-between">
        <div>
          <h1>Mercado P2P</h1>
          <p className="muted">Compra y vende stablecoins persona a persona. Cada oferta tiene una moneda, un método de pago y una red.</p>
        </div>
        <Link className="btn btn-primary" to="/crear-oferta">+ Crear oferta</Link>
      </div>

      <div className="tabs">
        <button className={`tab ${takerSide === 'buy' ? 'active' : ''}`} onClick={() => setTakerSide('buy')}>Comprar crypto</button>
        <button className={`tab ${takerSide === 'sell' ? 'active' : ''}`} onClick={() => setTakerSide('sell')}>Vender crypto</button>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="filters">
          <label><span>Crypto</span><select value={crypto} onChange={(e) => setCrypto(e.target.value)}><option value="">Todas</option>{STABLECOINS.map((s) => <option key={s.symbol} value={s.symbol}>{s.symbol}</option>)}</select></label>
          <label><span>Moneda fíat</span><select value={fiat} onChange={(e) => setFiat(e.target.value)}><option value="">Todas</option>{FIATS.map((f) => <option key={f} value={f}>{f}</option>)}</select></label>
          <label><span>Método de pago</span><select value={method} onChange={(e) => setMethod(e.target.value)}><option value="">Cualquiera</option>{PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}</select></label>
          <label><span>Monto en crypto</span><input type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ej. 50" /></label>
          <label><span>Buscar anunciante</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nombre del anunciante" /></label>
          <label><span>&nbsp;</span><button className="btn" onClick={() => { setCrypto(''); setFiat(''); setMethod(''); setAmount(''); setSearch('') }}>Limpiar filtros</button></label>
        </div>
      </div>

      <p className="muted">{filtered.length} oferta(s) · {takerSide === 'buy' ? 'Ves ofertas de quienes venden crypto.' : 'Ves ofertas de quienes compran crypto.'}</p>
      <div className="grid">
        {filtered.map((o) => <OfferCard key={o.id} offer={o} takerSide={takerSide} onTake={take} />)}
      </div>
      {filtered.length === 0 && <div className="card"><p>No hay ofertas con esos filtros. Prueba quitar el monto o el método.</p></div>}
    </div>
  )
}
