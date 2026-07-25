import { lazy, Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import AppShell from '../container/AppShell'
import Loader from '../components/common/Loader/Loader'
import { logoutUser } from '../redux/reducer/userSlice'
import { selectActiveStudent } from '../redux/reducer/certificateSlice.js'
import { logCertificatePrintAction } from '../redux/action/certificateAction'

// Lazy load routed components
const AboutPage = lazy(() => import('../pages/About/AboutPage'))
const CertificateSearch = lazy(() => import('../pages/Certificate/CertificateSearch'))
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'))
const HomePage = lazy(() => import('../pages/Home/HomePage'))
const LoginPage = lazy(() => import('../pages/Login/LoginPage'))
const StudentCertificatePage = lazy(() => import('../pages/StudentCertificate/StudentCertificatePage'))
const StudentDetailsPage = lazy(() => import('../pages/StudentDeatils/StudentDetailsPage'))
const StudentMarksheetPage = lazy(() => import('../pages/StudentMarksheet/StudentMarksheetPage'))
const StudentMoulviIslamiatCommerceMarksheetPage = lazy(() => import('../pages/Moulvi/StudentMoulviIslamiatCommerceMarksheetPage'))
const StudentMoulviScienceArtsMarksheetPage = lazy(() => import('../pages/Moulvi/StudentMoulviScienceArtsMarksheetPage'))
const StudentMoulviCertificatePage = lazy(() => import('../pages/Moulvi/StudentMoulviCertificatePage'))

// Lazy load dashboard panel components
const DashboardOverview = lazy(() => import('../pages/Dashboard/components/DashboardOverview'))
const AuditLogsPanel = lazy(() => import('../pages/Dashboard/components/AuditLogsPanel'))
const UserManagementPanel = lazy(() => import('../pages/Dashboard/components/UserManagementPanel'))
const ProfileSettingsPanel = lazy(() => import('../pages/Dashboard/components/ProfileSettingsPanel'))

// Protected Route Guard (checks authentication)
function ProtectedRoute() {
  const authUser = useSelector((state) => state.user.data)
  const location = useLocation()

  if (!authUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

// Role-Based Route Guard (checks RBAC role)
function RoleRoute({ allowedRoles, fallbackPath = '/profile' }) {
  const authUser = useSelector((state) => state.user.data)
  const role = (authUser?.role || 'USER').toUpperCase()

  if (!allowedRoles.includes(role)) {
    return <Navigate to={fallbackPath} replace />
  }
  return <Outlet />
}

// Main shell layout that renders header/footer and dynamic routed view
function AppLayout() {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.user.data)
  const isAuthenticated = Boolean(authUser)
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/home')
  }

  return (
    <AppShell
      authUser={authUser}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
    >
      <Outlet />
    </AppShell>
  )
}

// Dynamic Student Marksheet selector wrapper
function StudentMarksheetWrapper({ onRouteChange }) {
  const activeStudent = useSelector(selectActiveStudent)
  if (!activeStudent) {
    return <Navigate to="/certificate" replace />
  }

  const className = String(activeStudent.className || activeStudent.Class || '').toLowerCase()
  if (className.includes('moulvi')) {
    const stream = String(activeStudent.Stream || '').toUpperCase().trim()
    if (stream.includes('SCIENCE') || stream.includes('ARTS')) {
      return (
        <Suspense fallback={<Loader />}>
          <StudentMoulviScienceArtsMarksheetPage onRouteChange={onRouteChange} />
        </Suspense>
      )
    } else {
      return (
        <Suspense fallback={<Loader />}>
          <StudentMoulviIslamiatCommerceMarksheetPage onRouteChange={onRouteChange} />
        </Suspense>
      )
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <StudentMarksheetPage onRouteChange={onRouteChange} />
    </Suspense>
  )
}

// Dynamic Student Certificate selector wrapper
function StudentCertificateWrapper({ onRouteChange }) {
  const activeStudent = useSelector(selectActiveStudent)
  if (!activeStudent) {
    return <Navigate to="/certificate" replace />
  }

  const className = String(activeStudent.className || activeStudent.Class || '').toLowerCase()
  if (className.includes('moulvi')) {
    return (
      <Suspense fallback={<Loader />}>
        <StudentMoulviCertificatePage onRouteChange={onRouteChange} />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<Loader />}>
      <StudentCertificatePage onRouteChange={onRouteChange} />
    </Suspense>
  )
}

function AppRoutes() {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.user.data)
  const lastSearch = useSelector((state) => state.certificate.lastSearch)
  const navigate = useNavigate()

  useEffect(() => {
    const handleBeforePrint = () => {
      if (authUser && lastSearch) {
        dispatch(logCertificatePrintAction(lastSearch))
      }
    }
    window.addEventListener('beforeprint', handleBeforePrint)
    return () => window.removeEventListener('beforeprint', handleBeforePrint)
  }, [dispatch, authUser, lastSearch])

  const handleLegacyRouteChange = (routeId) => {
    if (routeId === 'certificate') navigate('/certificate')
    else if (routeId === 'dashboard') navigate('/dashboard')
    else if (routeId === 'student') navigate('/student')
    else if (routeId === 'studentMarksheet') navigate('/studentmarksheet')
    else if (routeId === 'studentCertificate') navigate('/studentscertificate')
    else navigate('/home')
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Suspense fallback={<Loader />}><HomePage onRouteChange={handleLegacyRouteChange} /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={<Loader />}><AboutPage /></Suspense>} />
        <Route path="/login" element={<Suspense fallback={<Loader />}><LoginPage /></Suspense>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/certificate" element={<Suspense fallback={<Loader />}><CertificateSearch /></Suspense>} />
          <Route path="/student" element={<Suspense fallback={<Loader />}><StudentDetailsPage /></Suspense>} />
          <Route path="/studentmarksheet" element={<StudentMarksheetWrapper onRouteChange={handleLegacyRouteChange} />} />
          <Route path="/studentscertificate" element={<StudentCertificateWrapper onRouteChange={handleLegacyRouteChange} />} />

          {/* Nested Dashboard Routes */}
          <Route element={<DashboardPage />}>
            
            {/* stats overview - operators, admins, superadmins only */}
            <Route element={<RoleRoute allowedRoles={['SUPERADMIN', 'ADMIN', 'OPERATOR']} fallbackPath="/profile" />}>
              <Route path="/dashboard" element={<Suspense fallback={<Loader />}><DashboardOverview /></Suspense>} />
            </Route>
            
            {/* update & print logs - admins and superadmins only */}
            <Route element={<RoleRoute allowedRoles={['SUPERADMIN', 'ADMIN']} fallbackPath="/dashboard" />}>
              <Route path="/dashboard/logs" element={<Suspense fallback={<Loader />}><AuditLogsPanel /></Suspense>} />
            </Route>
            
            {/* user account management - superadmins only */}
            <Route element={<RoleRoute allowedRoles={['SUPERADMIN']} fallbackPath="/dashboard" />}>
              <Route path="/dashboard/users" element={<Suspense fallback={<Loader />}><UserManagementPanel /></Suspense>} />
            </Route>

            {/* personal details - all roles */}
            <Route path="/profile" element={<Suspense fallback={<Loader />}><ProfileSettingsPanel user={authUser || {}} /></Suspense>} />
            
            {/* account security change password - all roles */}
            <Route path="/profile/security" element={<Suspense fallback={<Loader />}><ProfileSettingsPanel user={authUser || {}} /></Suspense>} />

          </Route>
        </Route>

      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default AppRoutes
