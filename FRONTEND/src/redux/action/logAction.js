import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchDashboardStatsApi,
  fetchUpdateLogsApi,
  fetchPrintLogsApi,
} from '../../services/logService'

export const fetchDashboardStatsAction = createAsyncThunk(
  'log/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDashboardStatsApi()
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats')
    }
  },
)

export const fetchUpdateLogsAction = createAsyncThunk(
  'log/fetchUpdateLogs',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      return await fetchUpdateLogsApi(page, limit)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch update logs')
    }
  },
)

export const fetchPrintLogsAction = createAsyncThunk(
  'log/fetchPrintLogs',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      return await fetchPrintLogsApi(page, limit)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch print logs')
    }
  },
)
