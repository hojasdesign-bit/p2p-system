import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CHAINS, FIATS, PAYMENT_METHODS, STABLECOINS } from '../config/stablecoins'
import { useStore } from '../lib/store'
import { useAuth } from '../lib/auth'
import OfferCard from '../components/OfferCard'

const PAGE_SIZE = 6

export default function MarketPage() {
  const { offers, createOrder } = useStore()
  const { isAuthenticated, openLogin } = useAuth()
  const navigate = useNavigate()
  // Perspectiva del taker: Comprar = yo compro crypto (ofertas sell_crypto).
  const [takerSide, setTakerSide] = useState('buy')
  const [crypto, setCrypto] = useState('')
  const [fiat, setFiat] = useState('')
  const [chain, setChain] = useState('')
  const [method, setMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const wantSide = takerSide === 'buy' ? 'sell_crypto' : 'buy_crypto'
    return offers.filter((o) => {
      if (o.status !== 'active') return false
      if (o.side !== wantSide) return false
      if (crypto && o.crypto !== crypto) return false
      if (fiat && o.fiat !== fiat) return false
      if (chain && String(o.chain_name) !== String(chain)) return false
      if (method && o.payment_method !== method) return false
      if (search && !o.owner_name.toLowerCase().includes(search.toLowerCase())) return false
      if (amount) {
        const a = Number(amount)
        if (!Number.isFinite(a) || a < Number(o.min_amount) || a > Number(o.max_amount) || a > Number(o.available)) return false
      }
      return true
    })
  }, [offers, takerSide, crypto, fiat, chain, method, amount, search])

  // Al cambiar filtros, volver a la primera página.
  useEffect(() => { setPage(1) }, [takerSide, crypto, fiat, chain, method, amount, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const to = Math.min(safePage * PAGE_SIZE, filtered.length)

  const clearFilters = () => { setCrypto(''); setFiat(''); setChain(''); setMethod(''); setAmount(''); setSearch('') }

  const take = (offer, cryptoAmount) => {
    if (!isAuthenticated) { openLogin(); return }
    const order = createOrder(offer, cryptoAmount)
    navigate(`/orden/${order.id}`)
  }

  return (
    <div className="container">
      <div className="row-between">
        <h1 className="market-title" style={{ marginBottom: 0 }}>Crypto</h1>
        <Link className="btn btn-primary" to="/crear-oferta">+ Crear oferta</Link>
      </div>

      <div className="market-card">
        <div className="market-filters">
          <div className="seg" role="tablist" aria-label="Comprar o vender">
            <button className={takerSide === 'buy' ? 'active' : ''} onClick={() => setTakerSide('buy')}>Comprar</button>
            <button className={takerSide === 'sell' ? 'active' : ''} onClick={() => setTakerSide('sell')}>Vender</button>
          </div>
          <span className="filter-group">
            <input type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Cantidad" aria-label="Cantidad" />
            <select value={crypto} onChange={(e) => setCrypto(e.target.value)} aria-label="Crypto">
              <option value="">{takerSide === 'buy' ? 'Comprar' : 'Vender'}</option>
              {STABLECOINS.map((s) => <option key={s.symbol} value={s.symbol}>{s.symbol}</option>)}
            </select>
          </span>
          <select className="filter-select" value={chain} onChange={(e) => setChain(e.target.value)} aria-label="Blockchain">
            <option value="">Cualquier blockchain</option>
            {CHAINS.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <button className="swap-btn" type="button" title="Invertir Comprar / Vender" onClick={() => setTakerSide((s) => (s === 'buy' ? 'sell' : 'buy'))}>⇄</button>
          <select className="filter-select" value={method} onChange={(e) => setMethod(e.target.value)} aria-label="Método de pago">
            <option value="">Cualquier método</option>
            {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="filter-select" value={fiat} onChange={(e) => setFiat(e.target.value)} aria-label="Moneda fíat">
            <option value="">{takerSide === 'buy' ? 'Vender' : 'Comprar'}</option>
            {FIATS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <button className="clear-filters" type="button" onClick={clearFilters}>↻ Eliminar filtros</button>
          <input className="filter-select" style={{ minWidth: 160 }} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar anunciante" aria-label="Buscar anunciante" />
        </div>

        <div className="market-table">
          <div className="market-head">
            <span>Das / Recibes</span>
            <span>Disponible / Min - Max</span>
            <span>Precio</span>
            <span>Red Blockchain</span>
            <span>Anunciante</span>
            <span />
          </div>
          {pageItems.map((o) => <OfferCard key={o.id} offer={o} takerSide={takerSide} onTake={take} />)}
          {filtered.length === 0 && <p className="muted" style={{ padding: '20px 4px' }}>No hay ofertas con esos filtros. Prueba quitar el monto o el método.</p>}
        </div>

        <div className="pagination">
          <span className="page-btns">
            <button className="page-btn" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} aria-label="Página anterior">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === safePage ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} aria-label="Página siguiente">›</button>
          </span>
          <span className="showing">Mostrando {from} - {to} de {filtered.length} items</span>
        </div>
      </div>

      <p className="muted" style={{ marginTop: 12, fontSize: 12 }}>Escrow simulado en el MVP: no hay movimiento real de dinero ni contrato on-chain.</p>
    </div>
  )
}
