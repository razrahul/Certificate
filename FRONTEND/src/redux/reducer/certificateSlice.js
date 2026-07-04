import { createSlice } from '@reduxjs/toolkit'
import { searchCertificateAction } from '../action/certificateAction'

const firstValue = (record, keys) => {
  for (const key of keys) {
    if (record?.[key] !== undefined && record[key] !== null && record[key] !== '') {
      return record[key]
    }
  }

  return ''
}

const normalizeCertificateRecord = (record, filters) => ({
  ...record,
  className: firstValue(record, ['className', 'Class', 'class', 'standard', 'Standard']) || filters.standard,
  category: firstValue(record, ['category', 'Cat']),
  centre: firstValue(record, ['centre', 'Centre']),
  district: firstValue(record, ['district', 'District']) || filters.district,
  dob: firstValue(record, ['dob', 'DOB']),
  fatherName: firstValue(record, ['fatherName', 'Father', 'FName', 'FatherName', 'father_name']),
  id:
    firstValue(record, ['id', '_id', 'Rgn', 'registrationNo', 'RollNo', 'rollNo']) ||
    `tr-${Date.now()}`,
  madrasaName: firstValue(record, ['madrasaName', 'Madrasa', 'NomMad']),
  marks: firstValue(record, ['marks', 'TotMs', 'Marks', 'Total', 'total', 'TotalMarks']),
  motherName: firstValue(record, ['motherName', 'Mother', 'MName', 'MotherName', 'mother_name']),
  registrationNo: firstValue(record, ['registrationNo', 'Rgn', 'RegNo', 'RegistrationNo']),
  rollNo: firstValue(record, ['rollNo', 'RollNo', 'Roll']),
  sex: firstValue(record, ['sex', 'Sex']),
  standard: firstValue(record, ['standard', 'Standard', 'Class', 'class']) || filters.standard,
  studentName: firstValue(record, ['studentName', 'Name', 'StudentName', 'student_name']),
  year: firstValue(record, ['year', 'Year']) || filters.year,
})

const initialState = {
  activeStudentId: null,
  error: '',
  lastSearch: null,
  printHistory: [],
  searchResult: null,
  searchStatus: 'idle',
  students: [],
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
        const normalizedRecord = normalizeCertificateRecord(record, filters)

        state.error = ''
        state.activeStudentId = normalizedRecord.id
        state.searchResult = normalizedRecord
        state.searchStatus = 'succeeded'
        state.students = [normalizedRecord]
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
  state.certificate.searchResult ||
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
