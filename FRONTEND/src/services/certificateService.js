const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_SERVER_URL ||
  import.meta.env.BACKEND_SERVER_URL ||
  'http://localhost:5500/api/v1'

const parseApiResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed')
  }

  return payload
}

export const loginUser = async ({ loginId, password }) => {
  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: loginId,
      username: loginId,
      password,
    }),
  })
  const payload = await parseApiResponse(response)

  return payload.data || payload.user || payload
}

export const searchCertificateRecord = async (filters) => {
  const response = await fetch(`${API_BASE_URL}/certificate/searchTR`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...filters,
      searchBy:
        filters.searchBy === 'registrationNo'
          ? 'Rgn'
          : filters.searchBy === 'rollNo'
            ? 'RollNo'
            : filters.searchBy,
    }),
  })
  const payload = await parseApiResponse(response)

  return payload.data || payload.record || payload.student || payload
}
