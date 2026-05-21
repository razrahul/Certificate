import { createAsyncThunk } from '@reduxjs/toolkit'
import { demoStudents } from '../../services/certificateService'

export const searchCertificateAction = createAsyncThunk(
  'certificate/search',
  async (filters, { rejectWithValue }) => {
    const searchValue = String(filters.searchValue || '').trim().toLowerCase()
    const record = demoStudents.find((student) => {
      const studentValue = String(student[filters.searchBy] || '')
        .trim()
        .toLowerCase()

      return (
        student.year === filters.year &&
        student.standard === filters.standard &&
        student.district === filters.district &&
        studentValue === searchValue
      )
    })

    if (!record) {
      return rejectWithValue('Dummy record nahi mila. Year, standard, district aur number check karein.')
    }

    return record
  },
)
