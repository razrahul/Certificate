import { useSelector } from 'react-redux'
import './StudentMarksheetPage.scss'

function StudentMarksheetPage({ onRouteChange }) {
  const student = useSelector((state) => state.certificate.searchResult)
  const totalFullMarks =
    student?.subjects?.reduce((sum, subject) => sum + subject.fullMarks, 0) || 500
  const totalObtained =
    student?.subjects?.reduce((sum, subject) => sum + subject.obtained, 0) ||
    Number(student?.marks || 0)

  if (!student) {
    return (
      <div className="student-marksheet-page empty-record-page">
        <h1>Marksheet not found</h1>
        <p>Pehle certificate page par student record search karein.</p>
        <button onClick={() => onRouteChange('certificate')} type="button">
          Go to Certificate Search
        </button>
      </div>
    )
  }

  return (
    <div className="student-marksheet-page">
      <div className="print-toolbar">
        <button onClick={() => onRouteChange('certificate')} type="button">
          Back
        </button>
        <button onClick={() => window.print()} type="button">
          Print Marksheet
        </button>
      </div>

      <section className="marksheet-paper printable-paper">
        <header>
          <span>Bihar State Madrasa Education Board, Patna</span>
          <h1>Statement of Marks</h1>
          <p>
            {student.className} Examination {student.year}
          </p>
        </header>

        <div className="paper-meta-grid">
          <span>Name: {student.studentName}</span>
          <span>Father Name: {student.fatherName}</span>
          <span>Roll No: {student.rollNo}</span>
          <span>Registration No: {student.registrationNo}</span>
          <span>District: {student.district}</span>
          <span>Madrasa: {student.madrasaName}</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Full Marks</th>
              <th>Marks Obtained</th>
            </tr>
          </thead>
          <tbody>
            {student.subjects.map((subject) => (
              <tr key={subject.name}>
                <td>{subject.name}</td>
                <td>{subject.fullMarks}</td>
                <td>{subject.obtained}</td>
              </tr>
            ))}
            <tr>
              <td>Total</td>
              <td>{totalFullMarks}</td>
              <td>{totalObtained}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default StudentMarksheetPage
