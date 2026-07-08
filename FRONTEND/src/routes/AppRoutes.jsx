import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppShell from '../container/AppShell'
import AboutPage from '../pages/About/AboutPage'
import CertificateSearch from '../pages/Certificate/CertificateSearch'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import HomePage from '../pages/Home/HomePage'
import LoginPage from '../pages/Login/LoginPage'
import StudentCertificatePage from '../pages/StudentCertificate/StudentCertificatePage'
import StudentDetailsPage from '../pages/StudentDeatils/StudentDetailsPage'
import StudentMarksheetPage from '../pages/StudentMarksheet/StudentMarksheetPage'
import StudentMoulviIslamiatCommerceMarksheetPage from '../pages/Moulvi/StudentMoulviIslamiatCommerceMarksheetPage'
import StudentMoulviScienceArtsMarksheetPage from '../pages/Moulvi/StudentMoulviScienceArtsMarksheetPage'
import StudentMoulviCertificatePage from '../pages/Moulvi/StudentMoulviCertificatePage'
import { logoutUser } from '../redux/reducer/userSlice'
import { selectActiveStudent } from '../redux/reducer/certificateSlice.js'
import { hiddenRoutes, pathToRouteId, routes } from './routeConfig'

const pageMap = {
  home: HomePage,
  certificate: CertificateSearch,
  about: AboutPage,
  dashboard: DashboardPage,
  login: LoginPage,
  student: StudentDetailsPage,
  studentMarksheet: StudentMarksheetPage,
  studentCertificate: StudentCertificatePage,
}

const getRouteFromPath = () =>
  pathToRouteId[window.location.pathname.toLowerCase()] || 'home'

function AppRoutes() {
  const dispatch = useDispatch()
  const [activeRoute, setActiveRoute] = useState(getRouteFromPath)
  const activeStudent = useSelector(selectActiveStudent)
  const authUser = useSelector((state) => state.user.data)
  const certificateState = useSelector((state) => state.certificate)
  const isAuthenticated = Boolean(authUser)

  useEffect(() => {
    const handlePopState = () => setActiveRoute(getRouteFromPath())
    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleRouteChange = (routeId) => {
    const route = [...routes, ...hiddenRoutes].find(
      (item) => item.id === routeId,
    )
    const nextPath = route?.path || '/home'

    window.history.pushState({}, '', nextPath)
    setActiveRoute(routeId)
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    handleRouteChange('home')
  }

  let CurrentPage = pageMap[activeRoute] || HomePage

  if (activeRoute === 'studentMarksheet' && activeStudent) {
    const className = String(activeStudent.className || activeStudent.Class || '').toLowerCase()
    if (className.includes('moulvi')) {
      const stream = String(activeStudent.Stream || '').toUpperCase().trim();
      if (stream.includes('SCIENCE') || stream.includes('ARTS')) {
        CurrentPage = StudentMoulviScienceArtsMarksheetPage
      } else {
        CurrentPage = StudentMoulviIslamiatCommerceMarksheetPage
      }
    }
  }

  if (activeRoute === 'studentCertificate' && activeStudent) {
    const className = String(activeStudent.className || activeStudent.Class || '').toLowerCase()
    if (className.includes('moulvi')) {
      CurrentPage = StudentMoulviCertificatePage
    }
  }

  return (
    <AppShell
      activeRoute={activeRoute}
      authUser={authUser}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
      onRouteChange={handleRouteChange}
    >
      <CurrentPage
        activeStudent={activeStudent}
        authUser={authUser}
        certificateState={certificateState}
        onRouteChange={handleRouteChange}
      />
    </AppShell>
  )
}

export default AppRoutes
