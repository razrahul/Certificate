import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  loginUserApi,
  logoutUserApi,
  fetchUserProfileApi,
  registerUserApi,
  fetchUsersListApi,
  toggleUserActiveApi,
  updateUserProfileApi,
  adminResetUserPasswordApi,
} from '../../services/userService'

export const loginUserAction = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUserApi(credentials)
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  },
)

export const logoutUserAction = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await logoutUserApi()
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed')
    }
  },
)

export const fetchUserProfileAction = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserProfileApi()
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user profile')
    }
  },
)

export const registerUserAction = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await registerUserApi(userData)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create user')
    }
  },
)

export const fetchUsersListAction = createAsyncThunk(
  'user/fetchList',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUsersListApi()
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users list')
    }
  },
)

export const toggleUserActiveAction = createAsyncThunk(
  'user/toggleActive',
  async (email, { rejectWithValue }) => {
    try {
      return await toggleUserActiveApi(email)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle active status')
    }
  },
)

export const updateUserProfileAction = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      return await updateUserProfileApi(profileData)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile')
    }
  },
)

export const adminResetUserPasswordAction = createAsyncThunk(
  'user/adminResetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      return await adminResetUserPasswordApi(payload)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reset password')
    }
  },
)
