import { useState } from 'react'
import { Link } from 'react-router-dom'
import { avatarColor, chainColor, cryptoCoin, fiatCoin, initials } from '../lib/visual'

// Fila del mercado estilo original. takerSide: 'buy' (quiero comprar crypto) | 'sell' (quiero vender crypto).
// Par: en Comprar, el fíat va detrás y la crypto delante; en Vender, al revés.
export default function OfferCard({ offer, takerSide, onTake }) {
  const [amount, setAmount] = useState('')
  const actionLabel = takerSide === 'buy' ? 'Comprar' : 'Vender'
  const valid = Number(amount) >= Number(offer.min_amount) && Number(amount) <= Number(offer.max_amount) && Number(amount) <= Number(offer.available)
  const fiat = fiatCoin(offer.fiat)
  const crypto = cryptoCoin(offer.crypto)
  const back = takerSide === 'buy' ? fiat : crypto
  const front = takerSide === 'buy' ? crypto : fiat
  const fiatMin = (Number(offer.min_amount) * Number(offer.price)).toLocaleString('es-ES', { maximumFractionDigits: 2 })
  const fiatMax = (Number(offer.max_amount) * Number(offer.price)).toLocaleString('es-ES', { maximumFractionDigits: 2 })

  return (
    <div className="market-row">
      <div className="cell-pair">
        <span className="coin-pair" aria-hidden="true">
          <span className="coin coin-back" style={{ background: back.bg }}>{back.symbol}</span>
          <span className="coin coin-front" style={{ background: front.bg }}>{front.symbol}</span>
        </span>
      </div>
      <div className="cell-available">
        <div className="avail">{Number(offer.available).toLocaleString('es-ES')} {offer.crypto}</div>
        <div className="range">${fiatMin} ~ ${fiatMax} {offer.fiat}</div>
      </div>
      <div className="cell-price">
        <div className="price-val">{Number(offer.price).toLocaleString('es-ES')} {offer.fiat}</div>
        <div className="price-unit">◈ 1 {offer.crypto}</div>
      </div>
      <div className="cell-chain">
        <span className="chain-pill"><span className="chain-dot" style={{ background: chainColor(offer.chain_name) }} />{offer.chain_name || 'Base Sepolia'}</span>
        <span className="muted" style={{ fontSize: 12 }}>{offer.payment_method}</span>
      </div>
      <div className="cell-advertiser">
        <Link to={`/perfil/${offer.owner_id}`} aria-label={`Ver perfil de ${offer.owner_name}`}>
          <span className="avatar avatar-md" style={{ background: avatarColor(offer.owner_name) }}>{initials(offer.owner_name)}</span>
        </Link>
        <div>
          <Link className="adv-name" to={`/perfil/${offer.owner_id}`}>{offer.owner_name}</Link>
          <div className="adv-meta">0&nbsp;&nbsp;👍 100%</div>
        </div>
      </div>
      <div className="cell-action">
        <input
          type="number" min={offer.min_amount} max={offer.max_amount} step="any"
          placeholder={`Cantidad ${offer.crypto}`}
          value={amount} onChange={(e) => setAmount(e.target.value)}
          aria-label={`Cantidad en ${offer.crypto}`}
        />
        <button className="btn btn-primary btn-sm" disabled={!valid} onClick={() => onTake(offer, Number(amount))}>
          {actionLabel} {offer.crypto}
        </button>
      </div>
    </div>
  )
}

export function WalletLine({ address }) {
  return <span title={address}>{address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '—'}</span>
}
