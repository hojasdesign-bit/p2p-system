import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatMoney, shortAddress } from '../config/stablecoins'

// Tarjeta de oferta. takerSide: 'buy' (quiero comprar crypto) | 'sell' (quiero vender crypto).
export default function OfferCard({ offer, takerSide, onTake }) {
  const [amount, setAmount] = useState('')
  const actionLabel = takerSide === 'buy' ? 'Comprar' : 'Vender'
  const valid = Number(amount) >= Number(offer.min_amount) && Number(amount) <= Number(offer.max_amount) && Number(amount) <= Number(offer.available)
  return (
    <article className="card offer">
      <div className="offer-top">
        <div>
          <Link className="seller" to={`/perfil/${offer.owner_id}`}>{offer.owner_name}</Link>
          <div className="muted">{offer.owner_location || '—'} · {offer.owner_trades ?? 0} operaciones · ★ {offer.owner_score ?? 100}</div>
        </div>
        <span className="tag">{offer.crypto}/{offer.fiat}</span>
      </div>
      <div className="row-between">
        <div>
          <div className="muted">Precio</div>
          <div className="price">{Number(offer.price).toLocaleString('es-ES')} <span style={{ fontSize: 13, fontWeight: 500 }}>{offer.fiat}/{offer.crypto}</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="muted">Disponible</div>
          <div><strong>{formatMoney(offer.available, offer.crypto)}</strong></div>
        </div>
      </div>
      <div className="muted">Límite: {formatMoney(offer.min_amount, offer.crypto)} — {formatMoney(offer.max_amount, offer.crypto)}</div>
      <div className="row">
        <span className="tag">{offer.payment_method}</span>
        <span className="tag">{offer.chain_name || 'Base Sepolia'}</span>
        <span className="tag">{offer.status === 'paused' ? 'Pausada' : 'Activa'}</span>
      </div>
      <div className="row">
        <input
          type="number" min={offer.min_amount} max={offer.max_amount} step="any"
          placeholder={`Cantidad en ${offer.crypto} (${offer.min_amount}–${offer.max_amount})`}
          value={amount} onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn btn-primary" disabled={!valid} onClick={() => onTake(offer, Number(amount))}>
          {actionLabel} {offer.crypto}
        </button>
      </div>
      <div className="muted" style={{ fontSize: 12 }}>Escrow simulado en el MVP: no hay movimiento real de dinero ni contrato on-chain.</div>
    </article>
  )
}

export function WalletLine({ address }) {
  return <span title={address}>{shortAddress(address)}</span>
}
