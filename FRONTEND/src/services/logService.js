import { apiClient, getApiErrorMessage } from './apiClient'

export const fetchDashboardStatsApi = async () => {
  try {
    const response = await apiClient.get('/logs/stats')
    return response.data.data || response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const fetchUpdateLogsApi = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get(`/logs/updates?page=${page}&limit=${limit}`)
    return response.data.data || response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const fetchPrintLogsApi = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get(`/logs/prints?page=${page}&limit=${limit}`)
    return response.data.data || response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}
