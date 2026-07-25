import './Modal.scss'

function ToggleStatusModal({
  userEmail,
  currentStatus,
  onConfirm,
  onClose,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <div>
            <h3>Confirm Status Change</h3>
            <p>Verify user deactivation or activation action.</p>
          </div>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5' }}>
            Are you sure you want to <strong>{currentStatus ? 'Deactivate' : 'Activate'}</strong> user account <strong>{userEmail}</strong>?
          </p>
          {currentStatus && (
            <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#ef4444', fontWeight: 'bold' }}>
              Warning: Deactivating this user will immediately terminate all of their active login sessions.
            </p>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-primary"
            style={{
              background: currentStatus ? '#dc2626' : '#10b981',
              color: '#ffffff',
            }}
          >
            Yes, {currentStatus ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ToggleStatusModal
