import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { formatMoney } from '../config/stablecoins'

const LABELS = { pending_payment: 'Esperando pago', paid: 'Pagada · esperando confirmación', completed: 'Completada', cancelled: 'Cancelada', disputed: 'En disputa' }

export default function OrderDetailPage() {
  const { id } = useParams()
  const { getOrder, updateOrder, currentUserId } = useStore()
  const [proof, setProof] = useState('')
  const [error, setError] = useState('')
  const order = getOrder(id)
  if (!order) return <div className="container"><h1>Orden no encontrada</h1><Link to="/ordenes">Volver a órdenes</Link></div>

  const isMaker = String(order.maker_id) === String(currentUserId)
  const isTaker = String(order.taker_id) === String(currentUserId)
  const isParticipant = isMaker || isTaker

  const markPaid = () => {
    if (!proof.trim()) { setError('Agrega el comprobante (texto o enlace) antes de marcar como pagada.'); return }
    updateOrder(order.id, { status: 'paid', proof: proof.trim() })
  }

  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <Link to="/ordenes">← Órdenes</Link>
      <div className="row-between"><h1>Orden {order.id.slice(0, 8)}</h1><span className={`status status-${order.status}`}>{LABELS[order.status]}</span></div>
      <p className="muted">Rol: {isMaker ? 'Maker' : isTaker ? 'Taker' : 'Visitante'} · Creada {new Date(order.created_at).toLocaleString('es-ES')}</p>

      <div className="card">
        <div className="kv"><span>Crypto</span><strong>{order.crypto_amount} {order.crypto}</strong></div>
        <div className="kv"><span>A pagar en fíat</span><strong>{formatMoney(order.fiat_amount, order.fiat)}</strong></div>
        <div className="kv"><span>Precio</span><span>{order.price} {order.fiat}/{order.crypto}</span></div>
        <div className="kv"><span>Método de pago</span><span>{order.payment_method}</span></div>
        <div className="kv"><span>Maker</span><span>{order.maker_name}</span></div>
        <div className="kv"><span>Taker</span><span>{order.taker_name}</span></div>
        {order.proof && <div className="kv"><span>Comprobante</span><span style={{ wordBreak: 'break-all' }}>{order.proof}</span></div>}
        <div className="kv"><span>Actualizada</span><span>{new Date(order.updated_at).toLocaleString('es-ES')}</span></div>
      </div>

      <h2>Flujo</h2>
      <ol className="muted">
        <li>Creada — esperando pago</li>
        <li>Marcar pagado (con comprobante)</li>
        <li>Confirmar recepción</li>
        <li>Completada</li>
      </ol>

      {isParticipant && order.status === 'pending_payment' && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Marcar como pagada</h2>
          <p className="muted">Quien paga transfiere el fíat por {order.payment_method} fuera de la app y pega aquí el comprobante.</p>
          <label>Comprobante (texto o enlace)</label>
          <input value={proof} onChange={(e) => setProof(e.target.value)} placeholder="Ej. Transferencia #1234 o enlace a la captura" />
          {error && <p className="error">{error}</p>}
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={markPaid}>Marcar como pagada</button>
            <button className="btn btn-danger" onClick={() => updateOrder(order.id, { status: 'cancelled' })}>Cancelar orden</button>
          </div>
        </div>
      )}

      {isParticipant && order.status === 'paid' && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Confirmar recepción</h2>
          <p className="muted">Quien recibe el fíat verifica el comprobante y confirma. En el MVP no hay escrow on-chain: el estado es el registro de la operación.</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => updateOrder(order.id, { status: 'completed' })}>Confirmar recepción</button>
            <button className="btn btn-danger" onClick={() => updateOrder(order.id, { status: 'disputed' })}>Disputar</button>
          </div>
        </div>
      )}

      {order.status === 'disputed' && (
        <div className="note">Orden en disputa. En el MVP no hay mediación automática: ambas partes deben resolverlo entre sí con el comprobante guardado.</div>
      )}
      {order.status === 'completed' && <p className="ok">Orden completada. ¡Gracias por usar peetoo!</p>}
      {!isParticipant && <p className="note">Solo maker y taker pueden actuar en esta orden.</p>}
    </div>
  )
}
