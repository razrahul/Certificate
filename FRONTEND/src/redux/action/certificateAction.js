import { createAsyncThunk } from '@reduxjs/toolkit'
import { searchCertificateRecord } from '../../services/certificateService'

export const searchCertificateAction = createAsyncThunk(
  'certificate/search',
  async (filters, { rejectWithValue }) => {
    try {
      return await searchCertificateRecord(filters)
    } catch (error) {
      return rejectWithValue(
        error.message ||
          'Certificate record nahi mila. Year, standard, district aur number check karein.',
      )
    }
  },
)
