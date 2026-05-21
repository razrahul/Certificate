import { createSlice } from '@reduxjs/toolkit'
import { loginUserAction } from '../action/userAction'

const readSavedUser = () => {
  try {
    const savedUser = window.localStorage.getItem('certificateDeskUser')
    return savedUser ? JSON.parse(savedUser) : null
  } catch {
    window.localStorage.removeItem('certificateDeskUser')
    return null
  }
}

const initialState = {
  data: readSavedUser(),
  error: '',
  status: 'idle',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser(state) {
      state.data = null
      state.error = ''
      state.status = 'idle'
      window.localStorage.removeItem('certificateDeskUser')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAction.pending, (state) => {
        state.error = ''
        state.status = 'loading'
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.data = action.payload
        state.error = ''
        state.status = 'succeeded'
        window.localStorage.setItem(
          'certificateDeskUser',
          JSON.stringify(action.payload),
        )
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.error = action.payload || 'Login failed'
        state.status = 'failed'
      })
  },
})

export const { logoutUser } = userSlice.actions
export default userSlice.reducer
