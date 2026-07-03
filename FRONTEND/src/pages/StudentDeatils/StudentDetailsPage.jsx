import { useSelector } from 'react-redux'
import {
  divisionFromCode,
  formatDate,
  getFullMarks,
  getTotalMarks,
} from '../../utils/certificate.js'
import './StudentDetailsPage.scss'

function StudentDetailsPage({ onRouteChange }) {
  const student = useSelector((state) => state.certificate.searchResult)
  const totalFullMarks = getFullMarks(student)
  const totalObtained = getTotalMarks(student)

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

  const studentRows = [
    ['Student Name', student.studentName],
    ['Father Name', student.fatherName],
    ['Mother Name', student.motherName],
    ['Date of Birth', formatDate(student.dob || student.DOB)],
    ['Gender', student.sex || student.Sex],
    ['Religion', student.Rel],
    ['Caste / Category', `${student.Caste || 'N/A'} / ${student.category || student.Cat || 'N/A'}`],
  ]
  const examRows = [
    ['Registration No', student.registrationNo],
    ['Roll No', student.rollNo],
    ['Class', student.className],
    ['Year', student.year],
    ['District', student.district],
    ['Candidate Type', student.category || student.Cat],
    ['Total Marks', `${totalObtained} / ${totalFullMarks}`],
    ['Division', divisionFromCode(student.Div, totalObtained)],
  ]
  const institutionRows = [
    ['Madrasa Code', student.MadCode],
    ['Madrasa Name', student.madrasaName || student.NomMad],
    ['Nomination Madrasa', student.NomMad],
    ['Centre No', student.Cent_No],
    ['Centre Name', student.centre || student.Centre],
    ['TR Page', student.TrPg],
    ['TR Page Serial', student.TrPgSl],
    ['TR Serial', student.TrSl],
  ]

  const renderRows = (rows) =>
    rows.map(([label, value]) => (
      <tr key={label}>
        <th scope="row">{label}</th>
        <td>{value || 'N/A'}</td>
      </tr>
    ))

  return (
    <div className="student-details-page">
      <section className="student-profile-card">
        <div>
          <span className="page-kicker">Student Details</span>
          <h1>{student.studentName}</h1>
          <p>{student.madrasaName || student.NomMad}</p>
        </div>
        <button onClick={() => onRouteChange('certificate')} type="button">
          Back to Search
        </button>
      </section>

      <section className="student-detail-summary">
        <article>
          <span>Registration No</span>
          <strong>{student.registrationNo}</strong>
        </article>
        <article>
          <span>Roll No</span>
          <strong>{student.rollNo}</strong>
        </article>
        <article>
          <span>Total Marks</span>
          <strong>
            {totalObtained} / {totalFullMarks}
          </strong>
        </article>
        <article>
          <span>Division</span>
          <strong>{divisionFromCode(student.Div, totalObtained)}</strong>
        </article>
      </section>

      <section className="student-detail-tables">
        <article className="detail-table-card">
          <h2>Student Record</h2>
          <table>
            <tbody>{renderRows(studentRows)}</tbody>
          </table>
        </article>

        <article className="detail-table-card">
          <h2>Examination Record</h2>
          <table>
            <tbody>{renderRows(examRows)}</tbody>
          </table>
        </article>

        <article className="detail-table-card detail-table-card--wide">
          <h2>Madrasa & T.R Record</h2>
          <table>
            <tbody>{renderRows(institutionRows)}</tbody>
          </table>
        </article>
      </section>
    </div>
  )
}

export default StudentDetailsPage
