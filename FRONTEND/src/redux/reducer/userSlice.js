import { createSlice } from '@reduxjs/toolkit'
import {
  loginUserAction,
  logoutUserAction,
  fetchUserProfileAction,
  registerUserAction,
  fetchUsersListAction,
  toggleUserActiveAction,
  updateUserProfileAction,
} from '../action/userAction'

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
  registerStatus: 'idle',
  registerError: '',
  registerSuccess: '',
  usersList: [],
  usersListStatus: 'idle',
  activeDashboardTab: 'dashboard',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser(state) {
      state.data = null
      state.error = ''
      state.status = 'idle'
      state.usersList = []
      state.activeDashboardTab = 'dashboard'
      window.localStorage.removeItem('certificateDeskUser')
    },
    clearRegisterState(state) {
      state.registerStatus = 'idle'
      state.registerError = ''
      state.registerSuccess = ''
    },
    setDashboardTab(state, action) {
      state.activeDashboardTab = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
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

      // Logout User
      .addCase(logoutUserAction.fulfilled, (state) => {
        state.data = null
        state.error = ''
        state.status = 'idle'
        state.usersList = []
        window.localStorage.removeItem('certificateDeskUser')
      })

      // Fetch Profile
      .addCase(fetchUserProfileAction.fulfilled, (state, action) => {
        if (action.payload) {
          state.data = { ...state.data, ...action.payload }
          window.localStorage.setItem(
            'certificateDeskUser',
            JSON.stringify(state.data),
          )
        }
      })

      // Register User
      .addCase(registerUserAction.pending, (state) => {
        state.registerStatus = 'loading'
        state.registerError = ''
        state.registerSuccess = ''
      })
      .addCase(registerUserAction.fulfilled, (state) => {
        state.registerStatus = 'succeeded'
        state.registerError = ''
        state.registerSuccess = 'User successfully created!'
      })
      .addCase(registerUserAction.rejected, (state, action) => {
        state.registerStatus = 'failed'
        state.registerError = action.payload || 'Failed to create user'
        state.registerSuccess = ''
      })

      // Fetch Users List
      .addCase(fetchUsersListAction.pending, (state) => {
        state.usersListStatus = 'loading'
      })
      .addCase(fetchUsersListAction.fulfilled, (state, action) => {
        state.usersListStatus = 'succeeded'
        state.usersList = action.payload || []
      })
      .addCase(fetchUsersListAction.rejected, (state) => {
        state.usersListStatus = 'failed'
      })

      // Toggle User Active Status
      .addCase(toggleUserActiveAction.fulfilled, (state, action) => {
        if (action.payload) {
          state.usersList = state.usersList.map((u) =>
            u.email === action.payload.email ? action.payload : u
          )
        }
      })

      // Update User Profile
      .addCase(updateUserProfileAction.fulfilled, (state, action) => {
        if (action.payload) {
          state.data = { ...state.data, ...action.payload }
          window.localStorage.setItem(
            'certificateDeskUser',
            JSON.stringify(state.data),
          )
        }
      })
  },
})

export const { logoutUser, clearRegisterState, setDashboardTab } = userSlice.actions
export default userSlice.reducer
