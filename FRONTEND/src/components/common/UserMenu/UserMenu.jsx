import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setDashboardTab } from '../../../redux/reducer/userSlice'
import './UserMenu.scss'

const UserMenu = ({ onLogout, activeRoute }) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.user.data)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!authUser) return null

  const handleLogoutClick = () => {
    setOpen(false)
    if (onLogout) {
      onLogout()
    }
  }

  const isDashboard = activeRoute === 'dashboard'
  const firstLetter = (authUser?.name || authUser?.username || authUser?.email || 'U')[0].toUpperCase()

  return (
    <div ref={menuRef} className={`user-menu ${open ? 'is-open' : ''}`}>
      <button
        className="avatar"
        type="button"
        aria-label="Open user menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {firstLetter}
      </button>

      {open && (
        <div className="dropdown" onClick={() => setOpen(false)}>
          {authUser?.role !== 'USER' && !isDashboard && (
            <Link to="/dashboard" className="menu-item" onClick={() => dispatch(setDashboardTab('dashboard'))}>
              DashBoard
            </Link>
          )}

          <Link to="/profile" className="menu-item" onClick={() => dispatch(setDashboardTab('profileSettings_personalInfo'))}>
            Profile
          </Link>

          <Link to="/profile/security" className="menu-item" onClick={() => dispatch(setDashboardTab('profileSettings_accountSecurity'))}>
            Security
          </Link>

          <button type="button" className="menu-item danger" onClick={handleLogoutClick}>
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
