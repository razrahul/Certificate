import { useNavigate } from 'react-router-dom'
import './DashboardSidebar.scss'

function DashboardSidebar({ user, role, activeSidebar }) {
  const navigate = useNavigate()

  return (
    <aside className="dash-sidebar">
      {/* Sidebar Header Brand */}
      <div className="dash-brand">
        <div className="brand-avatar">
          {role[0]}
        </div>
        <div className="brand-info">
          <h4>{user.name || user.username}</h4>
          <span>{role}</span>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="dash-nav">
        {role !== 'USER' && (
          <button
            onClick={() => navigate('/dashboard')}
            className={`dash-nav-btn ${activeSidebar === 'dashboard' ? 'is-active' : ''}`}
            type="button"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </button>
        )}

        {(role === 'SUPERADMIN' || role === 'ADMIN') && (
          <button
            onClick={() => navigate('/dashboard/logs')}
            className={`dash-nav-btn ${activeSidebar === 'logs' ? 'is-active' : ''}`}
            type="button"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Log Dashboard
          </button>
        )}

        {role === 'SUPERADMIN' && (
          <button
            onClick={() => navigate('/dashboard/users')}
            className={`dash-nav-btn ${activeSidebar === 'users' ? 'is-active' : ''}`}
            type="button"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            User Management
          </button>
        )}

        <button
          onClick={() => navigate('/profile')}
          className={`dash-nav-btn ${activeSidebar === 'profileSettings' ? 'is-active' : ''}`}
          type="button"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Profile Settings
        </button>
      </nav>
    </aside>
  )
}

export default DashboardSidebar
