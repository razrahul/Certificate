import { useSelector } from 'react-redux'
import MetricCard from '../../components/MetricCard/MetricCard'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import { notices } from '../../services/boardData'
import { selectPrintStats } from '../../redux/reducer/certificateSlice.js'
import './DashboardPage.scss'

function DashboardPage({ authUser, certificateState, onRouteChange }) {
  const printStats = useSelector(selectPrintStats)
  const user = authUser || {
    department: 'Certificate Desk',
    email: 'public-user@bsmeb.org',
    name: 'Public Operator',
    role: 'Operator',
  }

  return (
    <div className="dashboard-page">
      <SectionHeader
        eyebrow="Dashboard"
        title="Certificate printing dashboard"
        text="User details and certificate print counters for today, weekly, monthly and yearly reporting."
      />

      <section className="dashboard-summary">
        <article className="user-info-card">
          <span className="page-kicker">User information</span>
          <h3>{user.name}</h3>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{user.role || 'Operator'}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{user.department || 'Certificate Desk'}</dd>
            </div>
          </dl>
        </article>

        <div className="print-stat-grid">
          <MetricCard label="Today print" value={printStats.today} />
          <MetricCard label="Weekly print" value={printStats.weekly} />
          <MetricCard label="Monthly print" value={printStats.monthly} />
          <MetricCard label="Yearly print" value={printStats.yearly} />
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <span className="page-kicker">Quick action</span>
          <h3>Find certificate by Reg No or Roll No</h3>
          <p>
            Open certificate page and search records from backend API using
            year, standard and Bihar district filters.
          </p>
          <button onClick={() => onRouteChange('certificate')} type="button">
            Open Certificate
          </button>
        </article>

        <article className="dashboard-card">
          <span className="page-kicker">Queue status</span>
          <h3>{certificateState.students.length} ready records</h3>
          <p>
            Search results and certificate print actions will update this Redux
            dashboard state.
          </p>
        </article>

        <article className="dashboard-card dashboard-card--wide">
          <span className="page-kicker">Recent notices</span>
          <div className="dashboard-notices">
            {notices.map((notice) => (
              <p key={notice.date}>
                <strong>{notice.date}</strong>
                {notice.text}
              </p>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

export default DashboardPage
