import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { useAuth } from '../lib/auth'
import { formatMoney } from '../config/stablecoins'

const LABELS = { pending_payment: 'Esperando pago', paid: 'Pagada · esperando confirmación', completed: 'Completada', cancelled: 'Cancelada', disputed: 'En disputa' }

export default function OrdersPage() {
  const { myOrders, currentUserId } = useStore()
  const { isAuthenticated, openLogin } = useAuth()
  if (!isAuthenticated) return <div className="container"><h1>Órdenes</h1><p>Conéctate para ver tus órdenes.</p><button className="btn btn-primary" onClick={openLogin}>Conectar</button></div>
  return (
    <div className="container">
      <h1>Órdenes</h1>
      <p className="muted">Como maker y como taker.</p>
      {myOrders.length === 0 && <div className="card"><p>Aún no tienes órdenes. <Link to="/p2p">Ir al mercado</Link></p></div>}
      <div className="grid">
        {myOrders.map((o) => (
          <Link key={o.id} to={`/orden/${o.id}`} className="card" style={{ color: 'inherit' }}>
            <div className="row-between"><strong>{o.crypto_amount} {o.crypto} · {formatMoney(o.fiat_amount, o.fiat)}</strong><span className={`status status-${o.status}`}>{LABELS[o.status] || o.status}</span></div>
            <div className="muted">Precio {o.price} {o.fiat}/{o.crypto} · {o.payment_method}</div>
            <div className="muted">Rol: {String(o.maker_id) === String(currentUserId) ? 'Maker' : 'Taker'} · {new Date(o.created_at).toLocaleString('es-ES')}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
