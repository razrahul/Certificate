import { useState } from 'react'
import './Modal.scss'

function ResetPasswordModal({
  selectedUserEmail,
  resetPasswordStatus,
  onAdminResetPassword,
  onClose,
}) {
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [localError, setLocalError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError('')

    if (passwordForm.newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setLocalError('New password and confirm password do not match')
      return
    }

    // Call original handler with newPassword
    onAdminResetPassword(passwordForm.newPassword)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div>
            <h3>Reset Operator Password</h3>
            <p>Assign a secure new password for <strong>{selectedUserEmail}</strong>.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                New Password *
              </label>
              <input
                type="password"
                required
                placeholder="Enter at least 6 characters"
                style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>

            <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                placeholder="Re-type new password"
                style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>

            {localError && <p className="msg-error" style={{ margin: 0 }}>{localError}</p>}
            {resetPasswordStatus.error && <p className="msg-error" style={{ margin: 0 }}>{resetPasswordStatus.error}</p>}
            {resetPasswordStatus.success && <p className="msg-success" style={{ margin: 0 }}>{resetPasswordStatus.success}</p>}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resetPasswordStatus.loading}
              className="btn-primary"
            >
              {resetPasswordStatus.loading ? 'Updating...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordModal
