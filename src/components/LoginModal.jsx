import { useState } from 'react'
import { useAuth } from '../lib/auth'

// Solo se usa en modo demo. En modo OpenFort real, el modal lo abre el SDK.
export default function LoginModal() {
  const { loginOpen, closeLogin, loginDemo, isDemo } = useAuth()
  const [tab, setTab] = useState('google')
  const [email, setEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [wallet, setWallet] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  if (!loginOpen || !isDemo) return null

  const close = () => { setError(''); setOtpSent(false); closeLogin() }

  const google = () => {
    loginDemo({ method: 'google', email: 'usuario@gmail.com', name: name || 'Usuario Google' })
  }
  const sendOtp = () => {
    if (!email.includes('@')) { setError('Escribe un correo válido.'); return }
    setOtpSent(true)
    setError('')
  }
  const verifyOtp = () => {
    if (otp.trim().length < 4) { setError('Escribe el código de 6 dígitos. En demo, cualquier código de 6 dígitos funciona.'); return }
    loginDemo({ method: 'email_otp', email, name: email.split('@')[0] })
  }
  const walletLogin = () => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet.trim())) { setError('Escribe una dirección válida 0x… (40 hex).'); return }
    loginDemo({ method: 'wallet', walletAddress: wallet.trim(), name: name || 'Wallet propia' })
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="row-between"><h2 style={{ margin: 0 }}>Conectar a peetoo</h2><button className="btn btn-sm" onClick={close}>✕</button></div>
        <p className="muted">Modo demo: sin OpenFort configurado. Elige cómo entrar.</p>
        <div className="tabs">
          <button className={`tab ${tab === 'google' ? 'active' : ''}`} onClick={() => setTab('google')}>Google</button>
          <button className={`tab ${tab === 'email' ? 'active' : ''}`} onClick={() => setTab('email')}>Correo</button>
          <button className={`tab ${tab === 'wallet' ? 'active' : ''}`} onClick={() => setTab('wallet')}>Wallet propia</button>
        </div>
        {tab === 'google' && (
          <div>
            <label>Nombre (opcional)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={google}>Continuar con Google (demo)</button>
          </div>
        )}
        {tab === 'email' && (
          <div>
            <label>Correo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
            {!otpSent
              ? <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={sendOtp}>Enviar código</button>
              : (<><label>Código OTP</label><input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" /><button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={verifyOtp}>Verificar y entrar</button><p className="muted">Demo: cualquier código de 6 dígitos funciona.</p></>)}
          </div>
        )}
        {tab === 'wallet' && (
          <div>
            <label>Dirección de tu wallet</label>
            <input value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x…" />
            <label>Nombre (opcional)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={walletLogin}>Conectar wallet</button>
            <p className="muted">Solo se guarda tu dirección. Nunca escribas tu frase semilla ni tu clave privada.</p>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}
