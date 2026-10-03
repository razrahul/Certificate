import './Loader.scss'

function Loader() {
  return (
    <div className="portal-loader-container">
      <div className="portal-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-center"></div>
      </div>
      <p className="loader-text">Loading secure portal...</p>
    </div>
  )
}

export default Loader
