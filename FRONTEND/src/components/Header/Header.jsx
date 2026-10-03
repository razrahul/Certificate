import { Link, NavLink, useLocation } from 'react-router-dom'
import { boardProfile } from '../../services/boardData'
import UserMenu from '../common/UserMenu/UserMenu'
import './Header.scss'

const displayRoutes = [
  { id: 'home', label: 'Home', path: '/home' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'certificate', label: 'Certificate', path: '/certificate' },
]

function Header({
  isAuthenticated,
  onLogout,
}) {
  const location = useLocation()

  // Derive activeRoute from path
  const currentPath = location.pathname.toLowerCase()
  let activeRoute = 'home'
  if (currentPath.startsWith('/about')) activeRoute = 'about'
  if (currentPath.startsWith('/certificate')) activeRoute = 'certificate'
  if (currentPath.startsWith('/dashboard')) activeRoute = 'dashboard'
  if (currentPath.startsWith('/login')) activeRoute = 'login'

  return (
    <header className="site-header">
      <div className="top-contact">
        <span>{boardProfile.emails[0]}</span>
        <span>{boardProfile.phone}</span>
      </div>

      <div className="header-main">
        <Link
          aria-label="Go to home"
          className="brand"
          to="/home"
        >
          <img src="/Logo.png" alt="BSMEB Logo" className="brand__logo" />
          <span>
            <strong>{boardProfile.shortName}</strong>
            <small>{boardProfile.name}</small>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="site-nav">
          {isAuthenticated && displayRoutes.map((route) => (
            <NavLink
              className={({ isActive }) => isActive ? 'is-active' : ''}
              key={route.id}
              to={route.path}
            >
              {route.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <UserMenu
              activeRoute={activeRoute}
              onLogout={onLogout}
            />
          ) : (
             <NavLink
              className={({ isActive }) => isActive ? 'is-active' : ''}
              to="/login"
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
