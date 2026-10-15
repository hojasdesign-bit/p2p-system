import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { avatarColor, initials } from '../lib/visual'
import { shortAddress } from '../config/stablecoins'

export default function Header() {
  const { user, isAuthenticated, openLogin, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/p2p" className="logo">peetoo<span className="version-badge">v0.1.1</span></Link>
        <nav className="nav">
          <NavLink to="/p2p">P2P</NavLink>
          <NavLink to="/mis-ofertas">Mis ofertas</NavLink>
          <NavLink to="/ordenes">Órdenes</NavLink>
          <NavLink to="/mi-perfil">Mi perfil</NavLink>
        </nav>
        <div className="spacer" />
        {isAuthenticated ? (
          <div className="row">
            <span className="user-chip" title={user?.walletAddress}>
              <span className="avatar avatar-sm" style={{ background: avatarColor(user?.name) }}>{initials(user?.name)}</span>
              {user?.name} · {shortAddress(user?.walletAddress)}
            </span>
            <button className="btn btn-sm" onClick={() => { logout(); navigate('/p2p') }}>Salir</button>
          </div>
        ) : (
          <button className="btn btn-sm" onClick={openLogin}>Conectar</button>
        )}
      </div>
    </header>
  )
}
