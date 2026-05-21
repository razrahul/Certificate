import SectionHeader from '../../components/SectionHeader/SectionHeader'
import {
  boardProfile,
  courseEquivalence,
  onlineServices,
} from '../../services/boardData'
import './AboutPage.scss'

function AboutPage() {
  return (
    <div className="about-page">
      <SectionHeader
        eyebrow="About"
        title={boardProfile.name}
        text="The board was established under the Bihar State Madrasa Education Board Act, 1981 and manages Madrasa education services, examinations and certificate records."
      />

      <section className="about-intro-grid">
        <article className="about-main-card">
          <span className="page-kicker">Board profile</span>
          <h3>Government recognised statutory board</h3>
          <p>{boardProfile.recognition}</p>
          <p>
            The certificate printing module follows the board service pattern:
            clear public information, important notices and focused search for
            student records.
          </p>
        </article>
        <article className="contact-card">
          <span className="page-kicker">Head office</span>
          <h3>Head office</h3>
          <p>{boardProfile.address}</p>
          <p>{boardProfile.phone}</p>
          <p>{boardProfile.emails.join(' | ')}</p>
        </article>
      </section>

      <section className="about-services">
        <span className="page-kicker">Online workflows</span>
        <h3>Public services visible on the board site</h3>
        <div>
          {onlineServices.map((service) => (
            <article key={service}>{service}</article>
          ))}
        </div>
      </section>

      <section className="course-table-section">
        <h3>Courses and equivalence</h3>
        <div className="course-table">
          <div className="course-table__head">
            <span>Course</span>
            <span>Classes</span>
            <span>Equivalent</span>
            <span>Fee</span>
          </div>
          {courseEquivalence.map((course) => (
            <div className="course-table__row" key={course.course}>
              <span>{course.course}</span>
              <span>{course.classes}</span>
              <span>{course.equivalent}</span>
              <span>Rs. {course.fee}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage
