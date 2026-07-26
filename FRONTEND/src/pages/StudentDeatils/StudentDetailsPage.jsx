import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  divisionFromCode,
  formatDate,
  getTotalMarks,
} from '../../utils/certificate.js'
import { updateCertificateAction } from '../../redux/action/certificateAction'
import './StudentDetailsPage.scss'

function StudentDetailsPage() {
  const navigate = useNavigate()
  const student = useSelector((state) => state.certificate.searchResult)
  const lastSearch = useSelector((state) => state.certificate.lastSearch)
  const authUser = useSelector((state) => state.user.data)
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const canEdit = authUser && ['SUPERADMIN', 'ADMIN', 'OPERATOR'].includes(authUser.role)

  const getLocalFullMarks = (std) => {
    const cls = String(std?.className || std?.Class || '').toLowerCase()
    if (cls.includes('fauquania')) {
      return 1000
    }
    if (cls.includes('moulvi')) {
      return 800
    }
    return 1000
  }

  const totalFullMarks = getLocalFullMarks(student)
  const totalObtained = getTotalMarks(student)

  if (!student) {
    return (
      <div className="student-details-page empty-record-page">
        <h1>Student details not found</h1>
        <p>Pehle certificate page par student record search karein.</p>
        <button onClick={() => navigate('/certificate')} type="button">
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
  const classDisplay = (() => {
    const className = student?.className || ''
    if (className.toLowerCase().includes('moulvi') && student?.Stream) {
      return `${className} / ${student.Stream}`
    }
    return className
  })()

  const examRows = [
    ['Registration No', student.registrationNo],
    ['Roll No', student.rollNo],
    ['Class', classDisplay],
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
        <div style={{ display: 'flex', gap: '12px' }}>
          {canEdit && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              type="button"
              className="edit-btn"
            >
              Edit Record
            </button>
          )}
          <button onClick={() => navigate('/certificate')} type="button">
            Back to Search
          </button>
        </div>
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

      {isEditModalOpen && (
        <EditRecordModal
          student={student}
          lastSearch={lastSearch}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  )
}

function EditRecordModal({ student, lastSearch, onClose }) {
  const dispatch = useDispatch()
  const originalName = student.studentName || student.Name || ''
  const originalFather = student.fatherName || student.Father || ''
  const originalMother = student.motherName || student.Mother || ''
  const originalMadrasa = student.madrasaName || student.Madrasa || student.NomMad || ''
  const originalDob = student.dob || student.DOB || ''

  // Helper conversions for date picker (YYYY-MM-DD) vs DB format (DD-MM-YYYY)
  const toPickerFormat = (val) => {
    if (!val) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
    const match = val.match(/^(\d{2})-(\d{2})-(\d{4})$/)
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`
    }
    try {
      const d = new Date(val)
      if (!isNaN(d.getTime())) {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
      }
    } catch {
      return ''
    }
    return ''
  }

  const toDbFormat = (val) => {
    if (!val) return ''
    const match = val.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`
    }
    return val
  }

  const [nameInput, setNameInput] = useState(originalName)
  const [fatherInput, setFatherInput] = useState(originalFather)
  const [motherInput, setMotherInput] = useState(originalMother)
  const [madrasaInput, setMadrasaInput] = useState(originalMadrasa)
  const [dobInput, setDobInput] = useState(toPickerFormat(originalDob))

  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const getChangedFields = () => {
    const changes = {}
    if (nameInput.trim() !== originalName.trim()) changes.Name = nameInput.trim()
    if (fatherInput.trim() !== originalFather.trim()) changes.Father = fatherInput.trim()
    if (motherInput.trim() !== originalMother.trim()) changes.Mother = motherInput.trim()
    if (madrasaInput.trim() !== originalMadrasa.trim()) changes.Madrasa = madrasaInput.trim()
    if (dobInput !== toPickerFormat(originalDob)) changes.DOB = toDbFormat(dobInput)
    return changes
  }

  const changedFields = getChangedFields()
  const changedList = Object.keys(changedFields)
  const changedCount = changedList.length
  const isValid = changedCount >= 1 && changedCount <= 2

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return

    setStatus('loading')
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const resultAction = await dispatch(updateCertificateAction({
        filters: lastSearch,
        updates: changedFields
      }))

      if (updateCertificateAction.fulfilled.match(resultAction)) {
        setSuccessMsg('Record updated successfully!')
        setStatus('succeeded')
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setErrorMsg(resultAction.payload || 'Failed to update record')
        setStatus('failed')
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred')
      setStatus('failed')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3>Edit Student Record</h3>
            <p>Update student details. Security policy allows updating a maximum of 2 fields at a time.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              
              <div className="form-field">
                <label>
                  Student Name 
                  {nameInput.trim() !== originalName.trim() && (
                    <span className="modified-tag">Modified</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Student Name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>
                  Father Name 
                  {fatherInput.trim() !== originalFather.trim() && (
                    <span className="modified-tag">Modified</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Father Name"
                  value={fatherInput}
                  onChange={(e) => setFatherInput(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>
                  Mother Name 
                  {motherInput.trim() !== originalMother.trim() && (
                    <span className="modified-tag">Modified</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Mother Name"
                  value={motherInput}
                  onChange={(e) => setMotherInput(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>
                  Date of Birth 
                  {dobInput !== toPickerFormat(originalDob) && (
                    <span className="modified-tag">Modified</span>
                  )}
                </label>
                <input
                  type="date"
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                />
              </div>

              <div className="form-field form-field--full">
                <label>
                  Madrasa Name 
                  {madrasaInput.trim() !== originalMadrasa.trim() && (
                    <span className="modified-tag">Modified</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Madrasa Name"
                  value={madrasaInput}
                  onChange={(e) => setMadrasaInput(e.target.value)}
                />
              </div>

            </div>

            {changedCount > 2 && (
              <p className="msg-error">
                ⚠️ Security Policy: Ek baar mein maximum 2 fields hi update kar sakte hain. Aapne {changedCount} fields modify kiye hain: {changedList.join(', ')}.
              </p>
            )}

            {changedCount === 0 && (
              <p className="msg-info">
                ℹ️ Koi badlaav nahi kiya gaya. Koi bhi details badal kar Save karein.
              </p>
            )}

            {errorMsg && <p className="msg-error">❌ {errorMsg}</p>}
            {successMsg && <p className="msg-success">✅ {successMsg}</p>}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || status === 'loading'}
              className={`btn-save ${isValid ? 'btn-save--valid' : 'btn-save--invalid'}`}
            >
              {status === 'loading' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentDetailsPage
