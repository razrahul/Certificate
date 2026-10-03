import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_SERVER_URL ||
  import.meta.env.BACKEND_SERVER_URL ||
  'http://localhost:5500/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Request interceptor to attach JWT token if present in localStorage or state
apiClient.interceptors.request.use(
  (config) => {
    try {
      const savedUserStr = localStorage.getItem('certificateDeskUser')
      if (savedUserStr) {
        const savedData = JSON.parse(savedUserStr)
        const token = savedData?.token || savedData?.user?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
    return config
  },
  (error) => Promise.reject(error),
)

export const getApiErrorMessage = (error) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Request failed'
    )
  }
  return error?.message || 'Request failed'
}
