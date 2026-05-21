import { createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser } from '../../services/certificateService'

export const loginUserAction = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUser(credentials)
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  },
)
