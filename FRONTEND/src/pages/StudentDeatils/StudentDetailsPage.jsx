import { useSelector } from 'react-redux'
import { divisionFromMarks } from '../../utils/certificate.js'
import './StudentDetailsPage.scss'

function StudentDetailsPage({ onRouteChange }) {
  const student = useSelector((state) => state.certificate.searchResult)
  const totalFullMarks =
    student?.subjects?.reduce((sum, subject) => sum + subject.fullMarks, 0) || 500
  const totalObtained =
    student?.subjects?.reduce((sum, subject) => sum + subject.obtained, 0) ||
    Number(student?.marks || 0)

  if (!student) {
    return (
      <div className="student-details-page empty-record-page">
        <h1>Student details not found</h1>
        <p>Pehle certificate page par student record search karein.</p>
        <button onClick={() => onRouteChange('certificate')} type="button">
          Go to Certificate Search
        </button>
      </div>
    )
  }

  return (
    <div className="student-details-page">
      <section className="student-profile-card">
        <div>
          <span className="page-kicker">Student Details</span>
          <h1>{student.studentName}</h1>
          <p>{student.madrasaName}</p>
        </div>
        <button onClick={() => onRouteChange('certificate')} type="button">
          Back to Search
        </button>
      </section>

      <section className="student-detail-grid">
        <article>
          <span>Father Name</span>
          <strong>{student.fatherName}</strong>
        </article>
        <article>
          <span>Mother Name</span>
          <strong>{student.motherName}</strong>
        </article>
        <article>
          <span>Registration No</span>
          <strong>{student.registrationNo}</strong>
        </article>
        <article>
          <span>Roll No</span>
          <strong>{student.rollNo}</strong>
        </article>
        <article>
          <span>Standard / Year</span>
          <strong>
            {student.className} / {student.year}
          </strong>
        </article>
        <article>
          <span>District</span>
          <strong>{student.district}</strong>
        </article>
        <article>
          <span>Total Marks</span>
          <strong>
            {totalObtained} / {totalFullMarks}
          </strong>
        </article>
        <article>
          <span>Division</span>
          <strong>{divisionFromMarks(totalObtained)}</strong>
        </article>
      </section>
    </div>
  )
}

export default StudentDetailsPage
