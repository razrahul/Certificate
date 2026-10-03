import { configureStore } from '@reduxjs/toolkit'
import certificateReducer from './reducer/certificateSlice'
import userReducer from './reducer/userSlice'
import logReducer from './reducer/logSlice'

export const store = configureStore({
  reducer: {
    certificate: certificateReducer,
    user: userReducer,
    log: logReducer,
  },
})
