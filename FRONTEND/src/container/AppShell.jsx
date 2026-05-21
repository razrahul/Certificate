import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { routes } from '../routes/routeConfig'
import './AppShell.scss'

function AppShell({
  activeRoute,
  authUser,
  children,
  isAuthenticated,
  onLogout,
  onRouteChange,
}) {
  return (
    <div className="app-shell">
      <Header
        activeRoute={activeRoute}
        authUser={authUser}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        onRouteChange={onRouteChange}
        routes={routes}
      />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  )
}

export default AppShell
