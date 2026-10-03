import { apiClient, getApiErrorMessage } from './apiClient'

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

export const logCertificatePrintApi = async (filters) => {
  try {
    const response = await apiClient.post('/certificate/print-log', {
      ...filters,
      searchBy:
        filters.searchBy === 'registrationNo'
          ? 'Rgn'
          : filters.searchBy === 'rollNo'
            ? 'RollNo'
            : filters.searchBy,
    })

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const updateCertificateRecord = async (filters, updates) => {
  try {
    const response = await apiClient.put('/certificate/updateTR', {
      year: filters.year,
      standard: filters.standard,
      district: filters.district,
      searchBy:
        filters.searchBy === 'registrationNo'
          ? 'Rgn'
          : filters.searchBy === 'rollNo'
            ? 'RollNo'
            : filters.searchBy,
      searchValue: filters.searchValue,
      ...updates,
    })

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

