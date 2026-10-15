import { Link, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { formatMoney, shortAddress } from '../config/stablecoins'

export default function ProfilePage() {
  const { id } = useParams()
  const { offers } = useStore()
  const mine = offers.filter((o) => String(o.owner_id) === String(id))
  const first = mine[0]
  if (!first) return <div className="container"><h1>Perfil no encontrado</h1><Link to="/p2p">Volver al mercado</Link></div>
  const active = mine.filter((o) => o.status === 'active')
  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <Link to="/p2p">← Mercado</Link>
      <h1>{first.owner_name}</h1>
      <p className="muted">{first.owner_location} · {first.owner_trades ?? 0} operaciones · ★ {first.owner_score ?? 100}</p>
      <div className="card">
        <div className="kv"><span>Ofertas activas</span><strong>{active.length}</strong></div>
        <div className="kv"><span>Ofertas totales</span><span>{mine.length}</span></div>
      </div>
      <h2>Ofertas activas</h2>
      <div className="grid">
        {active.map((o) => (
          <div className="card" key={o.id}>
            <div className="row-between"><strong>{o.side === 'sell_crypto' ? 'Vende' : 'Compra'} {o.crypto} por {o.fiat}</strong><span className="tag">{o.payment_method}</span></div>
            <div>Precio: <strong>{o.price} {o.fiat}/{o.crypto}</strong> · Disponible: {formatMoney(o.available, o.crypto)}</div>
            <div className="muted">Límite {o.min_amount} – {o.max_amount} {o.crypto} · {o.chain_name}</div>
            <Link className="btn btn-sm" style={{ marginTop: 8 }} to="/p2p">Ver en el mercado</Link>
          </div>
        ))}
      </div>
      {active.length === 0 && <p className="muted">Sin ofertas activas.</p>}
      <p className="muted" style={{ marginTop: 12 }}>Wallet: {shortAddress(first.owner_id)}</p>
    </div>
  )
}
