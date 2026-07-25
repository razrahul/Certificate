import { apiClient, getApiErrorMessage } from './apiClient'

export const loginUserApi = async ({ loginId, password, rememberMe }) => {
  try {
    const response = await apiClient.post('/user/login', {
      email: loginId.includes('@') ? loginId : undefined,
      username: !loginId.includes('@') ? loginId : loginId,
      password,
      rememberMe: Boolean(rememberMe),
    })

    const payload = response.data.data || response.data
    // Ensure token is attached inside user payload if available
    if (payload.token && payload.user) {
      return {
        ...payload.user,
        token: payload.token,
      }
    }
    return payload
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const fetchUserProfileApi = async () => {
  try {
    const response = await apiClient.get('/user/profile')
    return response.data.data || response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const registerUserApi = async (userData) => {
  try {
    const response = await apiClient.post('/user/register', userData)
    return response.data.data || response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const logoutUserApi = async () => {
  try {
    const response = await apiClient.post('/user/logout')
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const fetchUsersListApi = async () => {
  try {
    const response = await apiClient.get('/user/list')
    return response.data.data || response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const toggleUserActiveApi = async (email) => {
  try {
    const response = await apiClient.put('/user/toggle-active', { email })
    return response.data.data || response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const updateUserProfileApi = async (profileData) => {
  try {
    const response = await apiClient.put('/user/profile', profileData)
    return response.data.data || response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const adminResetUserPasswordApi = async ({ email, newPassword }) => {
  try {
    const response = await apiClient.post('/user/admin-reset-password', { email, newPassword })
    return response.data.data || response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}
