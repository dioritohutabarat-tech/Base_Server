import { ExternalLink, Layers, LayoutDashboard, LogOut, Shield, Shirt, Users } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

const menu = [
  { to: '/admin', label: 'Dashboard', ikon: LayoutDashboard, end: true, ownerOnly: false },
  { to: '/admin/cucian', label: 'Kelola Cucian', ikon: Shirt, end: false, ownerOnly: false },
  { to: '/admin/layanan', label: 'Kelola Layanan', ikon: Layers, end: false, ownerOnly: true },
  { to: '/admin/staf', label: 'Kelola Admin/Staf', ikon: Users, end: false, ownerOnly: true },
]

export default function AdminLayout() {
  const { staf, logout } = useAuth()
  const navigate = useNavigate()

  if (!staf) return null

  const daftar = menu.filter((m) => !m.ownerOnly || staf.role === 'owner')

  function keluar() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="admin">
      <aside className="sidebar">
        <div className="sidebar-atas">
          <strong>Ceria Laundry</strong>
          <span>PANEL ADMIN</span>
        </div>

        <div className="sidebar-user">
          <span className="avatar">{staf.nama.charAt(0).toUpperCase()}</span>
          <div>
            <p>{staf.nama}</p>
            <small>
              <Shield size={12} />
              {staf.role === 'owner' ? 'Owner / Supervisor' : 'Staf Kasir'}
            </small>
          </div>
        </div>

        <nav className="sidebar-menu">
          {daftar.map((m) => {
            const Ikon = m.ikon
            return (
              <NavLink key={m.to} to={m.to} end={m.end}>
                <Ikon size={18} />
                {m.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-bawah">
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            Lihat Web Publik
            <span className="tag">Tab Baru</span>
          </a>
          <button type="button" className="logout" onClick={keluar}>
            <LogOut size={16} />
            Keluar (Logout)
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}