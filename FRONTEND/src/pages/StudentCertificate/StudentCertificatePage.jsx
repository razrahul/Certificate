import { useDispatch, useSelector } from 'react-redux'
import { markCertificatePrinted } from '../../redux/reducer/certificateSlice'
import { divisionFromMarks, formatDate } from '../../utils/certificate'
import './StudentCertificatePage.scss'

function StudentCertificatePage({ onRouteChange }) {
  const dispatch = useDispatch()
  const student = useSelector((state) => state.certificate.searchResult)
  const totalObtained =
    student?.subjects?.reduce((sum, subject) => sum + subject.obtained, 0) ||
    Number(student?.marks || 0)

  const handlePrint = () => {
    dispatch(markCertificatePrinted(student.id))
    window.print()
  }

  if (!student) {
    return (
      <div className="student-certificate-page empty-record-page">
        <h1>Certificate not found</h1>
        <p>Pehle certificate page par student record search karein.</p>
        <button onClick={() => onRouteChange('certificate')} type="button">
          Go to Certificate Search
        </button>
      </div>
    )
  }

  return (
    <div className="student-certificate-page">
      <div className="print-toolbar">
        <button onClick={() => onRouteChange('certificate')} type="button">
          Back
        </button>
        <button onClick={handlePrint} type="button">
          Print Certificate
        </button>
      </div>

      <section className="certificate-paper printable-paper">
        <header>
          <div>B</div>
          <span>Bihar State Madrasa Education Board, Patna</span>
          <h1>Original Certificate</h1>
        </header>
        <p>
          This is to certify that <strong>{student.studentName}</strong>,
          son/daughter of <strong>{student.fatherName}</strong> and{' '}
          <strong>{student.motherName}</strong>, has successfully passed{' '}
          <strong>
            {student.className} Examination {student.year}
          </strong>{' '}
          from {student.madrasaName}, District {student.district}.
        </p>
        <div className="paper-meta-grid">
          <span>Roll No: {student.rollNo}</span>
          <span>Registration No: {student.registrationNo}</span>
          <span>Total Marks: {totalObtained}</span>
          <span>Division: {divisionFromMarks(totalObtained)}</span>
          <span>Date: {formatDate(student.issueDate)}</span>
        </div>
        <footer>
          <span>Prepared By</span>
          <span>Controller of Examination</span>
          <span>Chairman</span>
        </footer>
      </section>
    </div>
  )
}

export default StudentCertificatePage
