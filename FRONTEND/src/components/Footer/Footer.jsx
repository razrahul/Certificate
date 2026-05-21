import { boardProfile } from '../../services/boardData'
import './Footer.scss'

function Footer() {
  return (
    <footer className="site-footer">
      <span>{boardProfile.name}</span>
      <span>{boardProfile.address}</span>
      <span>{boardProfile.phone}</span>
    </footer>
  )
}

export default Footer
