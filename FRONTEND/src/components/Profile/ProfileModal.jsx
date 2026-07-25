import './ProfileModal.scss'

function ProfileModal({ user, onClose }) {
  if (!user) return null

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <div className="profile-modal-avatar">
            {(user.name || user.username || 'U')[0].toUpperCase()}
          </div>
          <div className="profile-modal-title">
            <h2>{user.name || user.username}</h2>
            <span className={`role-badge role-badge--${(user.role || 'USER').toLowerCase()}`}>
              {user.role || 'USER'}
            </span>
          </div>
          <button className="profile-modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="profile-modal-body">
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">{user.name || 'N/A'}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Username</span>
              <span className="info-value">@{user.username || 'N/A'}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">{user.email || 'N/A'}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{user.phone || 'N/A'}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Department</span>
              <span className="info-value">{user.department || 'GENERAL'}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Office Location</span>
              <span className="info-value">{user.office || 'N/A'}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Account Status</span>
              <span className="info-value status-active">
                {user.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
