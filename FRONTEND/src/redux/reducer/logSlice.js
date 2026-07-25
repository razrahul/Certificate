import { createSlice } from '@reduxjs/toolkit'
import {
  fetchDashboardStatsAction,
  fetchUpdateLogsAction,
  fetchPrintLogsAction,
} from '../action/logAction'

const initialState = {
  stats: {
    updates: { daily: 0, weekly: 0 },
    prints: { daily: 0, weekly: 0 },
  },
  updateLogs: [],
  updateLogsTotal: 0,
  printLogs: [],
  printLogsTotal: 0,
  statsStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  updateLogsStatus: 'idle',
  printLogsStatus: 'idle',
  error: null,
}

const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    clearLogErrors(state) {
      state.error = null
    },
    resetLogState(state) {
      state.stats = {
        updates: { daily: 0, weekly: 0 },
        prints: { daily: 0, weekly: 0 },
      }
      state.updateLogs = []
      state.printLogs = []
      state.statsStatus = 'idle'
      state.updateLogsStatus = 'idle'
      state.printLogsStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStatsAction.pending, (state) => {
        state.statsStatus = 'loading'
      })
      .addCase(fetchDashboardStatsAction.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded'
        if (action.payload) {
          state.stats = {
            updates: action.payload.updates || state.stats.updates,
            prints: action.payload.prints || state.stats.prints,
          }
        }
      })
      .addCase(fetchDashboardStatsAction.rejected, (state, action) => {
        state.statsStatus = 'failed'
        state.error = action.payload
      })

      // Fetch Update Logs
      .addCase(fetchUpdateLogsAction.pending, (state) => {
        state.updateLogsStatus = 'loading'
      })
      .addCase(fetchUpdateLogsAction.fulfilled, (state, action) => {
        state.updateLogsStatus = 'succeeded'
        if (action.payload) {
          state.updateLogs = action.payload.logs || action.payload || []
          state.updateLogsTotal = action.payload.totalItems || state.updateLogs.length
        }
      })
      .addCase(fetchUpdateLogsAction.rejected, (state, action) => {
        state.updateLogsStatus = 'failed'
        state.error = action.payload
      })

      // Fetch Print Logs
      .addCase(fetchPrintLogsAction.pending, (state) => {
        state.printLogsStatus = 'loading'
      })
      .addCase(fetchPrintLogsAction.fulfilled, (state, action) => {
        state.printLogsStatus = 'succeeded'
        if (action.payload) {
          state.printLogs = action.payload.logs || action.payload || []
          state.printLogsTotal = action.payload.totalItems || state.printLogs.length
        }
      })
      .addCase(fetchPrintLogsAction.rejected, (state, action) => {
        state.printLogsStatus = 'failed'
        state.error = action.payload
      })
  },
})

export const { clearLogErrors, resetLogState } = logSlice.actions
export default logSlice.reducer
