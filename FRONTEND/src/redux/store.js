import { configureStore } from '@reduxjs/toolkit'
import certificateReducer from './reducer/certificateSlice'
import userReducer from './reducer/userSlice'

export const store = configureStore({
  reducer: {
    certificate: certificateReducer,
    user: userReducer,
  },
})
