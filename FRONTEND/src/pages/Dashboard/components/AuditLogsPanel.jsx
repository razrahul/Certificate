import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUpdateLogsAction, fetchPrintLogsAction } from '../../../redux/action/logAction'
import { formatDate } from '../../../utils/certificate'
import './AuditLogsPanel.scss'

function AuditLogsPanel() {
  const dispatch = useDispatch()
  const [logTab, setLogTab] = useState('updateLogs') // 'updateLogs' | 'printLogs'

  // Pagination states
  const [updatePage, setUpdatePage] = useState(1)
  const [printPage, setPrintPage] = useState(1)
  const limit = 10

  const authUser = useSelector((state) => state.user.data)
  const { 
    updateLogs, 
    updateLogsTotal, 
    printLogs, 
    printLogsTotal, 
    updateLogsStatus, 
    printLogsStatus 
  } = useSelector((state) => state.log)

  const role = (authUser?.role || 'USER').toUpperCase()

  // Fetch Update logs when updatePage changes
  useEffect(() => {
    dispatch(fetchUpdateLogsAction({ page: updatePage, limit }))
  }, [dispatch, updatePage])

  // Fetch Print logs when printPage changes
  useEffect(() => {
    dispatch(fetchPrintLogsAction({ page: printPage, limit }))
  }, [dispatch, printPage])

  // Filter logs for OPERATOR role to show only logs belonging to this operator
  const displayedUpdateLogs = role === 'OPERATOR'
    ? updateLogs.filter((log) => log.operatorUsername === authUser?.username || log.operatorId === authUser?.id)
    : updateLogs

  const displayedPrintLogs = role === 'OPERATOR'
    ? printLogs.filter((log) => log.operatorUsername === authUser?.username || log.operatorId === authUser?.id)
    : printLogs

  const loadingLogs = updateLogsStatus === 'loading' || printLogsStatus === 'loading'

  // Helper to format date as DD-MM-YYYY and append time (e.g. 10:30 AM)
  const formatDateTime = (value) => {
    if (!value) return ''
    const datePart = formatDate(value)
    try {
      const d = new Date(value)
      if (isNaN(d.getTime())) return datePart
      const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return `${datePart} ${timePart}`
    } catch {
      return datePart
    }
  }

  // Parse and display changes metadata beautifully
  const renderChanges = (updates) => {
    if (!updates) return <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No changes</span>
    let obj = updates
    if (typeof updates === 'string') {
      try {
        obj = JSON.parse(updates)
      } catch {
        return <span style={{ color: '#ef4444' }}>{updates}</span>
      }
    }

    if (typeof obj !== 'object' || obj === null) {
      return <span style={{ color: '#475569' }}>{String(updates)}</span>
    }

    const formatValue = (val) => {
      if (val && typeof val === 'object') {
        if ('old' in val || 'new' in val) {
          return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#dc2626', textDecoration: 'line-through' }}>{String(val.old || 'N/A')}</span>
              <span style={{ color: '#64748b' }}>➔</span>
              <span style={{ color: '#16a34a', fontWeight: '700' }}>{String(val.new || 'N/A')}</span>
            </span>
          )
        }
        return JSON.stringify(val)
      }
      return String(val)
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
        {Object.entries(obj).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontWeight: '800', color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem' }}>{key}:</span>
            <span style={{ color: '#0f172a', fontWeight: '600' }}>{formatValue(val)}</span>
          </div>
        ))}
      </div>
    )
  }

  // Render sub-table helper for Updates logs
  const renderUpdateLogsTable = () => {
    if (loadingLogs) {
      return <p style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Loading logs...</p>
    }
    if (displayedUpdateLogs.length === 0) {
      return <p style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>No update logs recorded yet.</p>
    }

    const totalPages = Math.ceil(updateLogsTotal / limit) || 1
    const startSNo = (updatePage - 1) * limit

    return (
      <div>
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>S.No</th>
                <th>Operator</th>
                <th>Class</th>
                <th>Year</th>
                <th>Roll/Reg ID</th>
                <th>District</th>
                <th>Changes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedUpdateLogs.map((log, index) => (
                <tr key={log.id}>
                  <td>{startSNo + index + 1}</td>
                  <td>
                    <strong>{log.operatorUsername}</strong>
                  </td>
                  <td>{log.className}</td>
                  <td>{log.year}</td>
                  <td style={{ color: '#0b5e9e', fontWeight: 'bold' }}>{log.certificateId}</td>
                  <td>{log.district}</td>
                  <td>{renderChanges(log.updates)}</td>
                  <td className="muted-text">{formatDateTime(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="pagination-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Page {updatePage} of {totalPages} (Total {updateLogsTotal} logs)
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setUpdatePage((prev) => Math.max(prev - 1, 1))}
              disabled={updatePage === 1}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.82rem', cursor: updatePage === 1 ? 'not-allowed' : 'pointer' }}
              type="button"
            >
              Previous
            </button>
            <button
              onClick={() => setUpdatePage((prev) => Math.min(prev + 1, totalPages))}
              disabled={updatePage === totalPages}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.82rem', cursor: updatePage === totalPages ? 'not-allowed' : 'pointer' }}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render sub-table helper for Prints logs
  const renderPrintLogsTable = () => {
    if (loadingLogs) {
      return <p style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>Loading logs...</p>
    }
    if (displayedPrintLogs.length === 0) {
      return <p style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>No print logs recorded yet.</p>
    }

    const totalPages = Math.ceil(printLogsTotal / limit) || 1
    const startSNo = (printPage - 1) * limit

    return (
      <div>
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>S.No</th>
                <th>Operator</th>
                <th>Class</th>
                <th>Year</th>
                <th>Roll/Reg No</th>
                <th>District</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedPrintLogs.map((log, index) => (
                <tr key={log.id}>
                  <td>{startSNo + index + 1}</td>
                  <td><strong>{log.operatorUsername}</strong></td>
                  <td>{log.className}</td>
                  <td>{log.year}</td>
                  <td style={{ color: '#0b5e9e', fontWeight: 'bold' }}>{log.certificateId || 'N/A'}</td>
                  <td>{log.district || 'N/A'}</td>
                  <td className="muted-text">{formatDateTime(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="pagination-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Page {printPage} of {totalPages} (Total {printLogsTotal} logs)
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setPrintPage((prev) => Math.max(prev - 1, 1))}
              disabled={printPage === 1}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.82rem', cursor: printPage === 1 ? 'not-allowed' : 'pointer' }}
              type="button"
            >
              Previous
            </button>
            <button
              onClick={() => setPrintPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={printPage === totalPages}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.82rem', cursor: printPage === totalPages ? 'not-allowed' : 'pointer' }}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="logs-panel-container">
      <div className="logs-panel">
        {/* Log Tabs */}
        <div className="panel-tabs">
          <button
            onClick={() => setLogTab('updateLogs')}
            className={`tab-btn ${logTab === 'updateLogs' ? 'is-active' : ''}`}
            type="button"
          >
            Update Logs ({updateLogsTotal})
          </button>
          <button
            onClick={() => setLogTab('printLogs')}
            className={`tab-btn ${logTab === 'printLogs' ? 'is-active' : ''}`}
            type="button"
          >
            Print Logs ({printLogsTotal})
          </button>
        </div>

        <div className="panel-content">
          <div className="panel-header">
            <h3>
              {logTab === 'updateLogs'
                ? 'Certificate Modification Audit Logs'
                : 'Certificate Printing Audit Logs'}
            </h3>
          </div>
          {logTab === 'updateLogs' ? renderUpdateLogsTable() : renderPrintLogsTable()}
        </div>
      </div>
    </div>
  )
}

export default AuditLogsPanel
