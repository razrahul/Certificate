import MetricCard from '../../components/MetricCard/MetricCard'
import {
  boardHighlights,
  boardOfficials,
  boardProfile,
  notices,
  quickLinks,
  serviceDescriptions,
} from '../../services/boardData'
import './HomePage.scss'

function HomePage({ certificateState, onRouteChange }) {
  return (
    <div className="home-page">
      <section className="official-hero">
        <div className="official-hero__content">
          <span className="page-kicker">Official certificate services</span>
          <h1>{boardProfile.name}</h1>
          <p>
            Certificate printing desk for Wastania, Fauquania and Moulvi records
            with public search, print dashboard and board-style notices.
          </p>
          <div className="quick-link-strip">
            {quickLinks.map((link) => (
              <button
                key={link}
                onClick={() =>
                  link === 'Madrasa Dashboard'
                    ? onRouteChange('dashboard')
                    : onRouteChange('certificate')
                }
                type="button"
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-notice-panel">
          <span className="page-kicker">Latest notices</span>
          {notices.map((notice) => (
            <article key={notice.date}>
              <time>{notice.date}</time>
              <p>{notice.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="officials-row">
        {boardOfficials.map((official) => (
          <article key={official.name}>
            <div>{official.badge}</div>
            <span>{official.name}</span>
            <p>{official.title}</p>
          </article>
        ))}
      </section>

      <section className="metrics-band">
        {boardHighlights.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
        <MetricCard label="Ready Certificates" value={certificateState.students.length} />
      </section>

      <section className="initiative-section">
        <div className="section-heading">
          <span className="page-kicker">Recent initiatives by BSMEB</span>
          <h2>Online services for Madrasa students</h2>
        </div>
        <div className="initiative-grid">
          {serviceDescriptions.map((service) => (
            <article key={service.title}>
              <div>{service.title.slice(0, 2)}</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
