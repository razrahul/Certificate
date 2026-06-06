import { useDispatch, useSelector } from 'react-redux'
import { markCertificatePrinted } from '../../redux/reducer/certificateSlice'
import {
  divisionFromCode,
  formatDate,
  getTotalMarks,
} from '../../utils/certificate'
import './StudentCertificatePage.scss'

function StudentCertificatePage({ onRouteChange }) {
  const dispatch = useDispatch()
  const student = useSelector((state) => state.certificate.searchResult)
  const totalObtained = getTotalMarks(student)

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
          from {student.madrasaName || student.NomMad}, District{' '}
          {student.district}.
        </p>
        <div className="paper-meta-grid">
          <span>Roll No: {student.rollNo}</span>
          <span>Registration No: {student.registrationNo}</span>
          <span>Date of Birth: {formatDate(student.dob || student.DOB)}</span>
          <span>Centre: {student.centre || student.Centre}</span>
          <span>Total Marks: {totalObtained}</span>
          <span>Division: {divisionFromCode(student.Div, totalObtained)}</span>
          <span>TR Page: {student.TrPg || 'N/A'}</span>
          <span>TR Serial: {student.TrSl || student.TrPgSl || 'N/A'}</span>
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
