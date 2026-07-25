import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchDashboardStatsAction } from '../../../redux/action/logAction'
import MetricCard from '../../../components/MetricCard/MetricCard'
import './DashboardOverview.scss'

function DashboardOverview() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authUser = useSelector((state) => state.user.data)
  const { stats, statsStatus } = useSelector((state) => state.log)

  const user = authUser || {}

  // Load dashboard stats on mount
  useEffect(() => {
    dispatch(fetchDashboardStatsAction())
  }, [dispatch])

  // Notices array
  const notices = [
    { date: '2026-07-20', text: 'Annual Fauquania & Moulvi database upgrade completed successfully.' },
    { date: '2026-07-15', text: 'Important: Do not share Operator login keys with third-party portals.' },
  ]

  const isLoading = statsStatus === 'loading'

  return (
    <div className="dash-overview-container">
      <div className="dash-top-banner">
        <div>
          <p>Hello, {user.name || user.username}</p>
          <h2>Welcome to BSMEB Certificate Portal</h2>
        </div>
        <button
          className="btn-banner-action"
          onClick={() => navigate('/certificate')}
          type="button"
        >
          + Find Certificate Record
        </button>
      </div>

      {/* Metrics cards grid */}
      <div className="dash-metrics-grid">
        <MetricCard label="Today Updates" value={isLoading ? '...' : stats.updates.daily} />
        <MetricCard label="Weekly Updates" value={isLoading ? '...' : stats.updates.weekly} />
        <MetricCard label="Today Prints" value={isLoading ? '...' : stats.prints.daily} />
        <MetricCard label="Weekly Prints" value={isLoading ? '...' : stats.prints.weekly} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
        <div className="dash-card-info">
          <h3>Quick Search Notice</h3>
          <p>
            All updates and prints performed by operators are cataloged automatically. Ensure double-checking student marksheet data before triggering any print logs.
          </p>
          <button
            onClick={() => navigate('/certificate')}
            className="btn-primary"
            type="button"
          >
            Open Certificate Search
          </button>
        </div>

        <div className="dash-card-info">
          <h3>System Announcements</h3>
          <div className="dash-notices">
            {notices.map((notice) => (
              <div key={notice.date} className="notice-item">
                <span className="notice-date">{notice.date}</span>
                <p className="notice-text">{notice.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
