import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, Outlet, Navigate } from 'react-router-dom'
import DashboardSidebar from './components/DashboardSidebar'
import './DashboardPage.scss'

function DashboardPage() {
  const location = useLocation()
  const authUser = useSelector((state) => state.user.data)

  const user = useMemo(() => authUser || {}, [authUser])
  const role = (user.role || 'USER').toUpperCase()

  // Guard USER role from hitting dashboard paths (redirect them to profile info)
  if (role === 'USER' && location.pathname.startsWith('/dashboard')) {
    return <Navigate to="/profile" replace />
  }

  // Derive activeSidebar dynamically from current URL path
  const currentPath = location.pathname.toLowerCase()
  let activeSidebar = 'dashboard'
  if (currentPath.startsWith('/profile')) {
    activeSidebar = 'profileSettings'
  } else if (currentPath.startsWith('/dashboard/logs')) {
    activeSidebar = 'logs'
  } else if (currentPath.startsWith('/dashboard/users')) {
    activeSidebar = 'users'
  }

  return (
    <div className="dashboard-page-container">
      
      {/* Sidebar Component */}
      <DashboardSidebar
        user={user}
        role={role}
        activeSidebar={activeSidebar}
      />

      {/* Main Content Area: Renders the active sub-route panel via Outlet */}
      <main className="dash-content">
        <Outlet />
      </main>

    </div>
  )
}

export default DashboardPage
