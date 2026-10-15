import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { useStore } from '../lib/store'
import { shortAddress } from '../config/stablecoins'

export default function MyProfilePage() {
  const { user, isAuthenticated, openLogin, updateName, isDemo } = useAuth()
  const { myOffers, myOrders } = useStore()
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  if (!isAuthenticated) return <div className="container"><h1>Mi perfil</h1><p>Conéctate para ver tu perfil.</p><button className="btn btn-primary" onClick={openLogin}>Conectar</button></div>

  const save = () => {
    if (!name.trim()) return
    updateName(name.trim())
    setSaved(true)
    setName('')
  }

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <h1>Mi perfil</h1>
      <div className="card">
        <div className="kv"><span>Nombre</span><strong>{user?.name}</strong></div>
        <div className="kv"><span>Correo</span><span>{user?.email || '—'}</span></div>
        <div className="kv"><span>Wallet</span><span title={user?.walletAddress}>{shortAddress(user?.walletAddress)}</span></div>
        <div className="kv"><span>Ubicación</span><span>{user?.location}</span></div>
        <div className="kv"><span>Ofertas publicadas</span><span>{myOffers.length}</span></div>
        <div className="kv"><span>Órdenes</span><span>{myOrders.length}</span></div>
      </div>
      {isDemo ? (
        <div className="card" style={{ marginTop: 12 }}>
          <label>Editar nombre (modo demo)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={user?.name} />
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={save}>Guardar nombre</button>
          {saved && <p className="ok">Nombre guardado.</p>}
        </div>
      ) : (
        <p className="note" style={{ marginTop: 12 }}>Con OpenFort, el nombre se gestiona desde tu cuenta. La edición de perfil completa es paso 2.</p>
      )}
    </div>
  )
}
