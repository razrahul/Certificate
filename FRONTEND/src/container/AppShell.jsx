import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import './AppShell.scss'

function AppShell({
  children,
  isAuthenticated,
  onLogout,
}) {
  return (
    <div className="app-shell">
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
      />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  )
}

export default AppShell
