import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  MdHome, MdLibraryMusic, MdSearch, MdQueueMusic,
  MdBarChart, MdPerson, MdLogout, MdAdminPanelSettings
} from 'react-icons/md'

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/', icon: <MdHome />, label: 'Home' },
    { to: '/library', icon: <MdLibraryMusic />, label: 'Library' },
    { to: '/search', icon: <MdSearch />, label: 'Search' },
    { to: '/playlists', icon: <MdQueueMusic />, label: 'Playlists' },
    { to: '/analytics', icon: <MdBarChart />, label: 'Analytics' },
    { to: '/profile', icon: <MdPerson />, label: 'Profile' },
  ]

  if (isAdmin()) {
    navItems.push({ to: '/admin', icon: <MdAdminPanelSettings />, label: 'Admin' })
  }

  return (
    <div className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), #b040ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'Syne'
          }}>S</div>
          <span style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px' }}>
            ScoutSeek
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--bg-hover)' : 'transparent',
              marginBottom: 2,
              transition: 'all 0.15s',
              textDecoration: 'none'
            })}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), #b040ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0
        }}>
          {(user?.username || user?.email || 'U')[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, truncate: true, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.username || user?.email}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {user?.role}
          </div>
        </div>
        <button className="btn-icon" onClick={handleLogout} title="Logout">
          <MdLogout />
        </button>
      </div>
    </div>
  )
}
