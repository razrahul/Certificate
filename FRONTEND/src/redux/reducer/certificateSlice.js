import { createSlice } from '@reduxjs/toolkit'
import { printQueue } from '../../services/certificateService'
import { searchCertificateAction } from '../action/certificateAction'

const today = new Date()
const daysAgo = (days) => {
  const date = new Date(today)
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

const initialState = {
  activeStudentId: printQueue[0]?.id,
  error: '',
  lastSearch: null,
  printHistory: [
    { id: 'prt-001', certificateId: 'std-001', printedAt: today.toISOString() },
    { id: 'prt-002', certificateId: 'std-002', printedAt: daysAgo(2) },
    { id: 'prt-003', certificateId: 'std-003', printedAt: daysAgo(16) },
    { id: 'prt-004', certificateId: 'std-001', printedAt: daysAgo(72) },
  ],
  searchResult: null,
  searchStatus: 'idle',
  students: printQueue,
}

const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {
    clearCertificateSearch(state) {
      state.error = ''
      state.searchResult = null
      state.searchStatus = 'idle'
    },
    markCertificatePrinted(state, action) {
      const certificateId = action.payload
      state.printHistory.unshift({
        id: `prt-${Date.now()}`,
        certificateId,
        printedAt: new Date().toISOString(),
      })
    },
    selectStudent(state, action) {
      state.activeStudentId = action.payload
    },
    updateActiveStudent(state, action) {
      state.students = state.students.map((student) =>
        student.id === state.activeStudentId
          ? { ...student, ...action.payload }
          : student,
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCertificateAction.pending, (state, action) => {
        state.error = ''
        state.lastSearch = action.meta.arg
        state.searchStatus = 'loading'
      })
      .addCase(searchCertificateAction.fulfilled, (state, action) => {
        const filters = state.lastSearch || {}
        const record = action.payload

        state.error = ''
        state.searchResult = {
          ...record,
          className: record.className || record.standard || filters.standard,
          district: record.district || filters.district,
          year: record.year || filters.year,
        }
        state.searchStatus = 'succeeded'
      })
      .addCase(searchCertificateAction.rejected, (state, action) => {
        state.error = action.payload || 'Certificate record not found'
        state.searchResult = null
        state.searchStatus = 'failed'
      })
  },
})

export const {
  clearCertificateSearch,
  markCertificatePrinted,
  selectStudent,
  updateActiveStudent,
} = certificateSlice.actions

export const selectActiveStudent = (state) =>
  state.certificate.students.find(
    (student) => student.id === state.certificate.activeStudentId,
  )

export const selectPrintStats = (state) => {
  const now = new Date()
  const history = state.certificate.printHistory
  const sameDay = (date) => date.toDateString() === now.toDateString()
  const sameYear = (date) => date.getFullYear() === now.getFullYear()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 6)

  return {
    monthly: history.filter((item) => {
      const printedAt = new Date(item.printedAt)
      return (
        printedAt.getFullYear() === now.getFullYear() &&
        printedAt.getMonth() === now.getMonth()
      )
    }).length,
    today: history.filter((item) => sameDay(new Date(item.printedAt))).length,
    weekly: history.filter((item) => new Date(item.printedAt) >= weekStart)
      .length,
    yearly: history.filter((item) => sameYear(new Date(item.printedAt))).length,
  }
}

export default certificateSlice.reducer
