import './MetricCard.scss'

function MetricCard({ label, value }) {
  return (
    <article className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  )
}

export default MetricCard
