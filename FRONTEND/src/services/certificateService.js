import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_SERVER_URL ||
  import.meta.env.BACKEND_SERVER_URL ||
  'http://localhost:5500/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

const getApiErrorMessage = (error) => {
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

const unwrapApiPayload = (payload) => {
  return payload.data || payload.record || payload.student || payload
}

export const loginUser = async ({ loginId, password }) => {
  try {
    const response = await apiClient.post('/user/login', {
      email: loginId,
      username: loginId,
      password,
    })

    return response.data.data || response.data.user || response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const searchCertificateRecord = async (filters) => {
  try {
    const response = await apiClient.post('/certificate/searchTR', {
      ...filters,
      searchBy:
        filters.searchBy === 'registrationNo'
          ? 'Rgn'
          : filters.searchBy === 'rollNo'
            ? 'RollNo'
            : filters.searchBy,
    })

    return unwrapApiPayload(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}
