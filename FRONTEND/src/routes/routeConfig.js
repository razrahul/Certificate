export const routes = [
  { id: 'home', label: 'Home', path: '/home' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'certificate', label: 'Certificate', path: '/certificate' },
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
]

export const hiddenRoutes = [
  { id: 'login', path: '/login' },
  { id: 'student', path: '/student' },
  { id: 'studentMarksheet', path: '/studentmarksheet' },
  { id: 'studentCertificate', path: '/studentscertificate' },
]

export const pathToRouteId = {
  '/': 'home',
  '/home': 'home',
  '/about': 'about',
  '/certificate': 'certificate',
  '/dashboard': 'dashboard',
  '/login': 'login',
  '/student': 'student',
  '/studentmarksheet': 'studentMarksheet',
  '/studentscertificate': 'studentCertificate',
}
