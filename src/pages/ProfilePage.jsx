import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { avatarColor, chainColor, cryptoCoin, fiatCoin, initials } from '../lib/visual'

export default function ProfilePage() {
  const { id } = useParams()
  const { offers } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all') // all | crypto | fiat — filtro visual de la tabla de órdenes
  const [statusFilter, setStatusFilter] = useState('all') // all | active | paused
  const mine = useMemo(() => offers.filter((o) => String(o.owner_id) === String(id)), [offers, id])
  const first = mine[0]
  if (!first) return <div className="container"><h1>Perfil no encontrado</h1><Link to="/p2p">Volver al mercado</Link></div>

  const trades = first.owner_trades ?? 0
  const score = first.owner_score ?? 100
  const methods = [...new Set(mine.map((o) => o.payment_method))]
  const visible = mine.filter((o) => {
    if (statusFilter === 'active' && o.status !== 'active') return false
    if (statusFilter === 'paused' && o.status !== 'paused') return false
    if (tab === 'crypto' && !['USDC', 'USDT'].includes(o.crypto)) return false
    if (tab === 'fiat' && ['USDC', 'USDT'].includes(o.crypto)) return false
    return true
  })
  // Anillo de score (SVG, sin librerías).
  const R = 52
  const C = 2 * Math.PI * R
  const ringOffset = C * (1 - Math.min(100, Math.max(0, score)) / 100)

  return (
    <div className="container">
      <h1 style={{ marginBottom: 4 }}>{first.owner_name}</h1>
      <p className="breadcrumb">P2P &nbsp;/&nbsp; <b>Perfil</b></p>

      <div className="profile-grid">
        <div>
          <div className="profile-card">
            <div className="profile-banner" />
            <div className="profile-avatar-wrap">
              <span className="avatar avatar-lg" style={{ background: avatarColor(first.owner_name) }}>{initials(first.owner_name)}</span>
            </div>
            <div className="profile-body">
              <div className="profile-name">{first.owner_name}</div>
              <p className="profile-desc">Anunciante de peetoo. Revisa sus ofertas activas y su historial en la plataforma.</p>
              <div className="info-boxes">
                <div className="info-box"><div className="lbl">Ubicación</div><div className="val">{first.owner_location || 'La Habana'}</div></div>
                <div className="info-box"><div className="lbl">Zona</div><div className="val">UTC-5 (CST)</div></div>
              </div>
            </div>
          </div>

          <div className="profile-card" style={{ marginTop: 16, padding: 16 }}>
            <strong style={{ fontSize: 14 }}>Métodos de Pago</strong>
            <div className="row" style={{ marginTop: 10 }}>
              {methods.map((m) => <span key={m} className="method-pill">{m}</span>)}
              {methods.length === 0 && <span className="muted">Sin métodos publicados.</span>}
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn" onClick={() => navigate('/p2p')}>Contactar</button>
            <button className="btn btn-primary" onClick={() => navigate('/p2p')}>Invitar a Operar</button>
          </div>
        </div>

        <div>
          <div className="stat-grid">
            <div className="stat-card"><div className="lbl">Operaciones <span>◈</span></div><div className="val">{trades}</div><div className="trend up">↗ +12%</div></div>
            <div className="stat-card"><div className="lbl">Completadas <span>✓</span></div><div className="val">0</div><div className="trend up">↗ +8%</div></div>
            <div className="stat-card"><div className="lbl">Volumen <span>↗</span></div><div className="val">$0</div><div className="trend up">↗ +24%</div></div>
            <div className="stat-card"><div className="lbl">Canceladas <span>⊗</span></div><div className="val">0</div><div className="trend down">↘ −2%</div></div>
          </div>

          <div className="grid cols-2" style={{ marginTop: 12 }}>
            <div className="score-card">
              <div className="score-head"><strong style={{ fontSize: 14 }}>Score General</strong><span className="score-badge">✦ Alto Potencial</span></div>
              <div className="score-ring-wrap">
                <svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label={`Score general ${score}`}>
                  <circle cx="70" cy="70" r={R} fill="none" stroke="#EFEDE7" strokeWidth="9" />
                  <circle cx="70" cy="70" r={R} fill="none" stroke="#22C55E" strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={C} strokeDashoffset={ringOffset} transform="rotate(-90 70 70)" />
                  <text x="70" y="78" textAnchor="middle" fontSize="30" fontWeight="700" fill="#111">{score}</text>
                </svg>
              </div>
            </div>
            <div className="score-card">
              <strong style={{ fontSize: 14 }}>Resumen General</strong>
              <div className="summary-list">
                <div className="summary-item"><span className="summary-ico" style={{ background: '#FEF3C7' }}>♛</span><div><div className="t">Clase Top</div><div className="d">Este trader está en el top 10</div></div></div>
                <div className="summary-item"><span className="summary-ico" style={{ background: '#DBEAFE' }}>◉</span><div><div className="t">Liderazgo</div><div className="d">Score de liderazgo por encima del promedio</div></div></div>
                <div className="summary-item"><span className="summary-ico" style={{ background: '#F3E8FF' }}>◍</span><div><div className="t">Historial</div><div className="d">Has operado con 0 contrapartes</div></div></div>
              </div>
            </div>
            <div className="score-card" style={{ gridColumn: '1 / -1' }}>
              <strong style={{ fontSize: 14 }}>Historial</strong>
              <div className="bar-row"><div className="bar-head"><span>{first.owner_name}</span><span>98%</span></div><div className="bar-track"><div className="bar-fill" style={{ width: '98%', background: '#111' }} /></div></div>
              <div className="bar-row"><div className="bar-head"><span>Otros traders</span><span>73%</span></div><div className="bar-track"><div className="bar-fill" style={{ width: '73%', background: '#C084FC' }} /></div></div>
              <p className="muted" style={{ marginTop: 10 }}>● Tú &nbsp;&nbsp;● Promedio</p>
            </div>
          </div>

          <div className="profile-orders">
            <div className="profile-orders-head">
              <div className="tabs">
                <button className="tab active" type="button">◈ Órdenes <span style={{ background: '#111', color: '#fff', borderRadius: 999, padding: '1px 7px', fontSize: 12, marginLeft: 4 }}>{mine.length}</span></button>
                <button className="tab" type="button">◷ Historial <span style={{ fontSize: 12, marginLeft: 4 }}>0</span></button>
              </div>
              <div className="tabs">
                <button className={`tab ${tab === 'all' ? 'active' : ''}`} type="button" onClick={() => setTab('all')}>Todas</button>
                <button className={`tab ${tab === 'crypto' ? 'active' : ''}`} type="button" onClick={() => setTab('crypto')}>Crypto</button>
                <button className={`tab ${tab === 'fiat' ? 'active' : ''}`} type="button" onClick={() => setTab('fiat')}>Fiat</button>
              </div>
            </div>
            <div className="tabs" style={{ marginTop: 10 }}>
              <button className={`tab ${statusFilter === 'all' ? 'active' : ''}`} type="button" onClick={() => setStatusFilter('all')}>Todos</button>
              <button className={`tab ${statusFilter === 'active' ? 'active' : ''}`} type="button" onClick={() => setStatusFilter('active')}>Activa</button>
              <button className={`tab ${statusFilter === 'paused' ? 'active' : ''}`} type="button" onClick={() => setStatusFilter('paused')}>Pausada</button>
            </div>

            <div className="orders-table-head">
              <span>Das / Recibes</span><span>Disponible / Min - Max</span><span>Precio</span><span>Métodos</span><span>Red</span><span>Acciones</span>
            </div>
            {visible.map((o) => {
              const fiat = fiatCoin(o.fiat)
              const crypto = cryptoCoin(o.crypto)
              // En la tabla del anunciante, el par muestra lo que el anunciante da detrás y lo que recibe delante.
              const back = o.side === 'sell_crypto' ? crypto : fiat
              const front = o.side === 'sell_crypto' ? fiat : crypto
              return (
                <div className="orders-row" key={o.id}>
                  <span className="coin-pair" aria-hidden="true">
                    <span className="coin coin-back" style={{ background: back.bg }}>{back.symbol}</span>
                    <span className="coin coin-front" style={{ background: front.bg }}>{front.symbol}</span>
                  </span>
                  <span>
                    <strong style={{ fontSize: 15 }}>{Number(o.available).toLocaleString('es-ES')} {o.crypto}</strong>
                    <div className="muted" style={{ fontSize: 13 }}>${(Number(o.min_amount) * Number(o.price)).toLocaleString('es-ES', { maximumFractionDigits: 2 })} ~ ${(Number(o.max_amount) * Number(o.price)).toLocaleString('es-ES', { maximumFractionDigits: 2 })} {o.fiat}</div>
                  </span>
                  <span>
                    <strong style={{ fontSize: 15 }}>{Number(o.price).toLocaleString('es-ES')} {o.fiat}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>◈ 1 {o.crypto}</div>
                  </span>
                  <span><span className="method-pill">{o.payment_method}</span></span>
                  <span><span className="chain-pill"><span className="chain-dot" style={{ background: chainColor(o.chain_name) }} />{o.chain_name}</span></span>
                  <span><Link to="/p2p" aria-label="Ver en el mercado" style={{ fontSize: 16 }}>👁</Link></span>
                </div>
              )
            })}
            {visible.length === 0 && <p className="muted" style={{ padding: '16px 4px' }}>Sin ofertas en esta vista.</p>}
            <div className="row" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
              <Link className="btn btn-primary btn-sm" to="/crear-oferta">⊕ Crear Oferta</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
