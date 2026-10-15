import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { useAuth } from '../lib/auth'
import { formatMoney } from '../config/stablecoins'

export default function MyOffersPage() {
  const { myOffers, updateOffer } = useStore()
  const { isAuthenticated, openLogin } = useAuth()
  const [editing, setEditing] = useState(null)
  const [price, setPrice] = useState('')
  const [available, setAvailable] = useState('')
  const [error, setError] = useState('')

  if (!isAuthenticated) return <div className="container"><h1>Mis ofertas</h1><p>Conéctate para ver tus ofertas.</p><button className="btn btn-primary" onClick={openLogin}>Conectar</button></div>

  const startEdit = (o) => { setEditing(o.id); setPrice(String(o.price)); setAvailable(String(o.available)); setError('') }
  const saveEdit = (o) => {
    const p = Number(price), av = Number(available)
    if (!(p > 0 && av > 0)) { setError('Precio y disponible deben ser mayores que 0.'); return }
    if (Number(o.max_amount) > av) { setError('Lo disponible no puede ser menor que el máximo por orden.'); return }
    updateOffer(o.id, { price: p, available: av })
    setEditing(null)
  }

  return (
    <div className="container">
      <div className="row-between"><h1>Mis ofertas</h1><Link className="btn btn-primary" to="/crear-oferta">+ Crear oferta</Link></div>
      {myOffers.length === 0 && <div className="card"><p>Aún no tienes ofertas.</p><Link className="btn btn-primary" to="/crear-oferta">Crear la primera</Link></div>}
      <div className="grid">
        {myOffers.map((o) => (
          <div className="card" key={o.id}>
            <div className="row-between">
              <strong>{o.side === 'sell_crypto' ? 'Vendo' : 'Compro'} {o.crypto} por {o.fiat}</strong>
              <span className={`status status-${o.status}`}>{o.status === 'active' ? 'Activa' : o.status === 'paused' ? 'Pausada' : 'Cancelada'}</span>
            </div>
            <div className="kv"><span>Precio</span><strong>{o.price} {o.fiat}/{o.crypto}</strong></div>
            <div className="kv"><span>Disponible</span><span>{formatMoney(o.available, o.crypto)}</span></div>
            <div className="kv"><span>Límite</span><span>{o.min_amount} – {o.max_amount} {o.crypto}</span></div>
            <div className="kv"><span>Método</span><span>{o.payment_method}</span></div>
            <div className="kv"><span>Red</span><span>{o.chain_name}</span></div>
            {editing === o.id ? (
              <div>
                <label>Nuevo precio</label><input type="number" step="any" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
                <label>Nuevo disponible</label><input type="number" step="any" min="0" value={available} onChange={(e) => setAvailable(e.target.value)} />
                {error && <p className="error">{error}</p>}
                <div className="row" style={{ marginTop: 10 }}><button className="btn btn-primary btn-sm" onClick={() => saveEdit(o)}>Guardar</button><button className="btn btn-sm" onClick={() => setEditing(null)}>Cancelar</button></div>
              </div>
            ) : (
              <div className="row" style={{ marginTop: 10 }}>
                <button className="btn btn-sm" onClick={() => startEdit(o)}>Editar precio / disponible</button>
                {o.status === 'active' && <button className="btn btn-sm" onClick={() => updateOffer(o.id, { status: 'paused' })}>Pausar</button>}
                {o.status === 'paused' && <button className="btn btn-sm" onClick={() => updateOffer(o.id, { status: 'active' })}>Reanudar</button>}
                {o.status !== 'cancelled' && <button className="btn btn-danger btn-sm" onClick={() => updateOffer(o.id, { status: 'cancelled' })}>Cancelar</button>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
