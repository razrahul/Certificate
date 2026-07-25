import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { updateUserProfileAction } from '../../../redux/action/userAction'
import './ProfileSettingsPanel.scss'

function ProfileSettingsPanel({ user }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Derive profileTab from path
  const profileTab = location.pathname.endsWith('/security') ? 'accountSecurity' : 'personalInfo'

  // State managed locally to avoid synchronous setState in parent useEffect
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    department: user.department || '',
    office: user.office || 'patna_office',
  })
  const [profileMessage, setProfileMessage] = useState({ success: '', error: '' })

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordMessage, setPasswordMessage] = useState({ success: '', error: '', loading: false })

  // Save profile info
  const handleProfileSave = async (e) => {
    e.preventDefault()
    setProfileMessage({ success: '', error: '' })
    try {
      const result = await dispatch(updateUserProfileAction(profileForm))
      if (updateUserProfileAction.fulfilled.match(result)) {
        setProfileMessage({ success: 'Profile details saved successfully!', error: '' })
      } else {
        setProfileMessage({ success: '', error: result.payload || 'Failed to update profile' })
      }
    } catch (err) {
      setProfileMessage({ success: '', error: err.message || 'Error updating profile' })
    }
  }

  // Change password
  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setPasswordMessage({ success: '', error: '', loading: true })

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ success: '', error: 'New password and confirm password do not match', loading: false })
      return
    }

    try {
      const response = await fetch('/api/v1/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      })
      const result = await response.json()
      if (response.ok) {
        setPasswordMessage({ success: 'Password changed successfully!', error: '', loading: false })
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setPasswordMessage({ success: '', error: result.message || 'Failed to change password', loading: false })
      }
    } catch (err) {
      setPasswordMessage({ success: '', error: err.message || 'Error changing password', loading: false })
    }
  }

  return (
    <div className="profile-split-view-container">
      <div className="profile-split-view">
        {/* Nested Sub-sidebar */}
        <div className="profile-nav">
          <button
            onClick={() => navigate('/profile')}
            className={`profile-nav-btn ${profileTab === 'personalInfo' ? 'is-active' : ''}`}
            type="button"
          >
            Personal Information
          </button>
          <button
            onClick={() => navigate('/profile/security')}
            className={`profile-nav-btn ${profileTab === 'accountSecurity' ? 'is-active' : ''}`}
            type="button"
          >
            Account Security
          </button>
        </div>

        {/* Profile Tab Contents */}
        <div className="profile-pane">
          {profileTab === 'personalInfo' ? (
            <form onSubmit={handleProfileSave} className="form-profile">
              <div className="form-header">
                <h3>Personal Information</h3>
                <p>Update your profile information like name, phone number, and location.</p>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="emailReadOnly">Email Address (Read Only)</label>
                  <input
                    id="emailReadOnly"
                    type="text"
                    disabled
                    value={user.email || ''}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="usernameReadOnly">Username (Read Only)</label>
                  <input
                    id="usernameReadOnly"
                    type="text"
                    disabled
                    value={user.username || ''}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    id="phoneNumber"
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="officeLocation">Office Location</label>
                  <select
                    id="officeLocation"
                    value={profileForm.office}
                    onChange={(e) => setProfileForm({ ...profileForm, office: e.target.value })}
                  >
                    <option value="patna_office">Patna Office</option>
                    <option value="purnia_office">Purnia Office</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="department">Department</label>
                  <input
                    id="department"
                    type="text"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  />
                </div>
              </div>

              {profileMessage.error && <p className="msg-error">{profileMessage.error}</p>}
              {profileMessage.success && <p className="msg-success">{profileMessage.success}</p>}

              <button type="submit" className="btn-submit">
                Save Changes
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSave} className="form-password">
              <div className="form-header">
                <h3>Account Security</h3>
                <p>Update your account credentials to keep your session secure.</p>
              </div>

              <div className="form-field">
                <label htmlFor="oldPassword">Old Password</label>
                <input
                  id="oldPassword"
                  type="password"
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>

              {passwordMessage.error && <p className="msg-error">{passwordMessage.error}</p>}
              {passwordMessage.success && <p className="msg-success">{passwordMessage.success}</p>}

              <button
                type="submit"
                disabled={passwordMessage.loading}
                className="btn-submit"
              >
                {passwordMessage.loading ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileSettingsPanel
