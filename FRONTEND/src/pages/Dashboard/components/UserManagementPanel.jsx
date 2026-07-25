import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUsersListAction,
  toggleUserActiveAction,
  registerUserAction,
  adminResetUserPasswordAction,
} from '../../../redux/action/userAction'
import { clearRegisterState } from '../../../redux/reducer/userSlice'

import AddUserModal from './AddUserModal'
import ResetPasswordModal from './ResetPasswordModal'
import ToggleStatusModal from './ToggleStatusModal'
import './UserManagementPanel.scss'

function UserManagementPanel() {
  const dispatch = useDispatch()

  // Select states from Redux
  const { usersList, usersListStatus, registerStatus, registerError, registerSuccess } = useSelector((state) => state.user)

  // Modals visibility states
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [showToggleActiveModal, setShowToggleActiveModal] = useState(false)

  // Target inputs
  const [selectedUserEmail, setSelectedUserEmail] = useState('')
  const [resetPasswordStatus, setResetPasswordStatus] = useState({ success: '', error: '', loading: false })
  const [activeToggleEmail, setActiveToggleEmail] = useState('')
  const [activeToggleStatus, setActiveToggleStatus] = useState(false)

  // Register Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    department: 'GENERAL',
    role: 'OPERATOR',
    office: 'patna_office',
  })

  // Load user lists on mount
  useEffect(() => {
    dispatch(fetchUsersListAction())
  }, [dispatch])

  // Open add user dialog
  const handleOpenAddUser = () => {
    dispatch(clearRegisterState())
    setNewUserForm({
      name: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      department: 'GENERAL',
      role: 'OPERATOR',
      office: 'patna_office',
    })
    setShowAddUserModal(true)
  }

  // Create new user submit handler
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearRegisterState())
    const result = await dispatch(registerUserAction(newUserForm))
    if (registerUserAction.fulfilled.match(result)) {
      setShowAddUserModal(false)
      dispatch(fetchUsersListAction())
    }
  }

  // Toggle active status confirmation trigger
  const handleToggleActiveClick = (email, currentStatus) => {
    setActiveToggleEmail(email)
    setActiveToggleStatus(currentStatus)
    setShowToggleActiveModal(true)
  }

  // Actual API dispatch on status deactivation confirm
  const handleConfirmToggleActive = async () => {
    setShowToggleActiveModal(false)
    await dispatch(toggleUserActiveAction(activeToggleEmail))
  }

  // Reset operator password modal trigger
  const openResetPasswordDialog = (email) => {
    setSelectedUserEmail(email)
    setResetPasswordStatus({ success: '', error: '', loading: false })
    setShowResetPasswordModal(true)
  }

  // Actual reset password submit dispatch
  const handleAdminResetPasswordSubmit = async (newPassword) => {
    setResetPasswordStatus({ success: '', error: '', loading: true })
    const result = await dispatch(adminResetUserPasswordAction({ email: selectedUserEmail, newPassword }))
    if (adminResetUserPasswordAction.fulfilled.match(result)) {
      setResetPasswordStatus({ success: 'Password reset successfully!', error: '', loading: false })
      setTimeout(() => {
        setShowResetPasswordModal(false)
        setResetPasswordStatus({ success: '', error: '', loading: false })
      }, 1500)
    } else {
      setResetPasswordStatus({ success: '', error: result.payload || 'Failed to reset password', loading: false })
    }
  }

  return (
    <div className="user-panel-container">
      <div className="user-panel">
        <div className="panel-content">
          <div className="panel-header">
            <div>
              <h3>System Users</h3>
              <p>Create and manage accounts, toggle active status, and reset passwords.</p>
            </div>
            <button
              onClick={handleOpenAddUser}
              className="btn-primary"
              type="button"
            >
              + Add User
            </button>
          </div>

          {usersListStatus === 'loading' ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading users list...</p>
          ) : (
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Office</th>
                    <th>Department</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((userObj) => (
                    <tr key={userObj.id}>
                      <td>
                        <strong>{userObj.name}</strong>
                        <div className="muted-text">@{userObj.username}</div>
                      </td>
                      <td>{userObj.email}</td>
                      <td>
                        <span className={`badge-role badge-role--${userObj.role.toLowerCase()}`}>
                          {userObj.role}
                        </span>
                      </td>
                      <td>{userObj.office || 'N/A'}</td>
                      <td>{userObj.department || 'GENERAL'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleToggleActiveClick(userObj.email, userObj.isActive)}
                          className={`status-btn ${userObj.isActive ? 'is-active' : 'is-inactive'}`}
                          type="button"
                        >
                          {userObj.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => openResetPasswordDialog(userObj.email)}
                          className="btn-secondary"
                          style={{ padding: '6px 12px' }}
                          type="button"
                        >
                          Reset Password
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Register User Modal */}
      {showAddUserModal && (
        <AddUserModal
          newUserForm={newUserForm}
          setNewUserForm={setNewUserForm}
          registerStatus={registerStatus}
          registerError={registerError}
          registerSuccess={registerSuccess}
          onCreateUser={handleCreateUserSubmit}
          onClose={() => setShowAddUserModal(false)}
        />
      )}

      {/* Admin Reset Password Modal */}
      {showResetPasswordModal && (
        <ResetPasswordModal
          selectedUserEmail={selectedUserEmail}
          resetPasswordStatus={resetPasswordStatus}
          onAdminResetPassword={handleAdminResetPasswordSubmit}
          onClose={() => setShowResetPasswordModal(false)}
        />
      )}

      {/* Confirm Toggle Status Modal */}
      {showToggleActiveModal && (
        <ToggleStatusModal
          userEmail={activeToggleEmail}
          currentStatus={activeToggleStatus}
          onConfirm={handleConfirmToggleActive}
          onClose={() => setShowToggleActiveModal(false)}
        />
      )}
    </div>
  )
}

export default UserManagementPanel
