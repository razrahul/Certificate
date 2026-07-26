import { createAsyncThunk } from '@reduxjs/toolkit'
import { searchCertificateRecord, logCertificatePrintApi, updateCertificateRecord } from '../../services/certificateService'

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

export const logCertificatePrintAction = createAsyncThunk(
  'certificate/logPrint',
  async (filters, { rejectWithValue }) => {
    try {
      return await logCertificatePrintApi(filters)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to log print action')
    }
  },
)

export const updateCertificateAction = createAsyncThunk(
  'certificate/update',
  async ({ filters, updates }, { rejectWithValue }) => {
    try {
      const response = await updateCertificateRecord(filters, updates)
      return response.data || response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update certificate record')
    }
  },
)

