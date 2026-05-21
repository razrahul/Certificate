import { boardProfile } from '../../services/boardData'
import './Header.scss'

function Header({
  activeRoute,
  authUser,
  isAuthenticated,
  onLogout,
  onRouteChange,
  routes,
}) {
  return (
    <header className="site-header">
      <div className="top-contact">
        <span>{boardProfile.emails[0]}</span>
        <span>{boardProfile.phone}</span>
      </div>

      <div className="header-main">
        <button
          aria-label="Go to home"
          className="brand"
          onClick={() => onRouteChange('home')}
          type="button"
        >
          <span className="brand__seal">B</span>
          <span>
            <strong>{boardProfile.shortName}</strong>
            <small>{boardProfile.name}</small>
          </span>
        </button>

        <nav aria-label="Primary navigation" className="site-nav">
          {routes.map((route) => (
            <button
              className={activeRoute === route.id ? 'is-active' : ''}
              key={route.id}
              onClick={() => onRouteChange(route.id)}
              type="button"
            >
              {route.label}
            </button>
          ))}
          {isAuthenticated ? (
            <button className="nav-user" onClick={onLogout} type="button">
              {authUser?.name || 'Logout'}
            </button>
          ) : (
            <button
              className={activeRoute === 'login' ? 'is-active' : ''}
              onClick={() => onRouteChange('login')}
              type="button"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
