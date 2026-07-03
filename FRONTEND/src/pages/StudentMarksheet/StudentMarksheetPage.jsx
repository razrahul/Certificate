<<<<<<< Updated upstream
import { useSelector } from 'react-redux'
import './StudentMarksheetPage.scss'

function StudentMarksheetPage({ onRouteChange }) {
  const student = useSelector((state) => state.certificate.searchResult)
  const totalFullMarks =
    student?.subjects?.reduce((sum, subject) => sum + subject.fullMarks, 0) || 500
  const totalObtained =
    student?.subjects?.reduce((sum, subject) => sum + subject.obtained, 0) ||
    Number(student?.marks || 0)
=======
import { useState } from "react";
import { useSelector } from "react-redux";
import PrintPaper from "../../components/PrintPaper/PrintPaper";
import {
  divisionFromCode,
  formatDate,
  getClassStandardDisplayName,
  getYearFromRecord,
  numberToWords,
} from "../../utils/certificate";
import "./StudentMarksheetPage.scss";

function StudentMarksheetPage({ onRouteChange }) {
  const student = useSelector((state) => state.certificate.searchResult);
  const [showBackground, setShowBackground] = useState(true);
>>>>>>> Stashed changes

  if (!student) {
    return (
      <div className="student-marksheet-page empty-record-page">
        <h1>Marksheet not found</h1>
        <p>Pehle certificate page par student record search karein.</p>
        <button onClick={() => onRouteChange("certificate")} type="button">
          Go to Certificate Search
        </button>
      </div>
    );
  }

  // Calculate Obtained Marks
  const dinI = Number(student.DIN_I || 0);
  const dinII = Number(student.DIN_II || student.DID_II || 0);
  const dinGr = Number(student.DINGr || 0);
  const dinTot = Number(student.DIN_TOT || dinI + dinII) + dinGr;

  const urdu = Number(student.URDU || 0) + Number(student.URDGr || 0);
  const persian = Number(student.PER || 0) + Number(student.PERGr || 0);
  const arabic = Number(student.ARB || 0) + Number(student.ARBGr || 0);
  const hindi = Number(student.HIN || 0) + Number(student.HINGr || 0);
  const english = Number(student.ENG || 0) + Number(student.ENGGr || 0);
  const sst = Number(student.SST || 0) + Number(student.SSTGr || 0);
  const mat = Number(student.MAT || 0) + Number(student.MATGr || 0);

  const sct = Number(student.SCT || 0);
  const scp = Number(student.SCP || 0);
  const scGr = Number(student.SCGr || 0);
  const scTot = Number(student.SCTOT || sct + scp) + scGr;

  const totMs = Number(student.TotMs || student.marks || 0);
  const totMsInWords = numberToWords(totMs);
  const examYear = getYearFromRecord(student);
  const classInfo = getClassStandardDisplayName(student.className);

  // Determine Division and Result
  const divName = divisionFromCode(student.Div, totMs);
  const divisionStatus = divName ? divName.toUpperCase() : "-";
  const resultStatus =
    divisionStatus === "PENDING" || divisionStatus === "FAIL" ? "FAIL" : "PASS";

  return (
    <div className="student-marksheet-page">
      <div className="print-toolbar">
        <label className="toggle-bg-label">
          <input
            type="checkbox"
            checked={showBackground}
            onChange={(e) => setShowBackground(e.target.checked)}
          />
          Show Template Background
        </label>
        <button onClick={() => onRouteChange("certificate")} type="button">
          Back
        </button>
        <button onClick={() => window.print()} type="button">
          Print Marksheet
        </button>
      </div>

<<<<<<< Updated upstream
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
=======
      <PrintPaper showBackground={showBackground} type="marksheet">
        {/* Absolute positioned MS No to sit on the template's dotted line */}
        <div className="ms-no-overlay">
          <span>MS.NO. : {student.MsNo || student.SlNo || ""}</span>
        </div>

        {/* Outer content container */}
        <div className="marksheet-content">
          <div className="header-padding"></div>

          <h2 className="exam-title">
            MARKS SHEET FOR {classInfo.name}
            {classInfo.suffixNumber && (
              <>
                ({classInfo.suffixNumber}
                <sup>{classInfo.suffixText}</sup>)
              </>
            )}{" "}
            EXAMINATION {examYear}
          </h2>

          <div className="student-info-section">
            <div className="info-row">
              <div className="info-cell full-width">
                <span className="label">NAME OF CANDIDATE</span>
                <span className="dots">:</span>
                <span className="value">
                  {student.studentName || student.Name || ""}
                </span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-cell full-width">
                <span className="label">FATHER'S NAME</span>
                <span className="dots">:</span>
                <span className="value">
                  {student.fatherName || student.Father || ""}
                </span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-cell full-width">
                <span className="label">MOTHER'S NAME</span>
                <span className="dots">:</span>
                <span className="value">
                  {student.motherName || student.Mother || ""}
                </span>
              </div>
            </div>
            <div className="info-row split">
              <div className="info-cell">
                <span className="label">REGISTRATION NO.</span>
                <span className="dots">:</span>
                <span className="value">
                  {student.registrationNo || student.Rgn || ""}
                </span>
              </div>
              <div className="info-cell">
                <span className="label">ROLL NO. WITH CODE</span>
                <span className="dots">:</span>
                <span className="value">
                  {student.rollNo || student.RollNo || ""}
                </span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-cell full-width">
                <span className="label">NAME OF MADRASA</span>
                <span className="dots">:</span>
                <span className="value">
                  {student.madrasaName ||
                    student.NomMad ||
                    student.Madrasa ||
                    ""}
                </span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-cell">
                <span className="label">DATE OF BIRTH</span>
                <span className="dots">:</span>
                <span className="value">
                  {formatDate(student.dob || student.DOB)}
                </span>
              </div>
            </div>
          </div>

          <table className="marksheet-table">
            <thead>
              <tr>
                <th className="col-sub">SUBJECTS OFFERED</th>
                <th className="col-full">Full Marks</th>
                <th className="col-pass">Pass Marks</th>
                <th className="col-obt">Marks Obtained</th>
                <th className="col-rem">Remarks</th>
>>>>>>> Stashed changes
              </tr>
            </thead>
            <tbody>
              {/* DINIYAT PAPER I */}
              <tr>
                <td>DINIYAT PAPER - I</td>
                <td>100</td>
                <td rowSpan="2" className="merged-pass-marks">
                  66
                </td>
                <td className="center-text">{dinI || "0"}</td>
                {/* Merged Remarks cell for the top half */}
                <td rowSpan="6" className="merged-remarks-rules">
                  <div className="rules-content">
                    <strong>MINIMUM MARKS FOR</strong>
                    <div className="rule-item">Distinction - 750</div>
                    <div className="rule-item">First Div - 600</div>
                    <div className="rule-item">Second Div - 450</div>
                    <div className="rule-item">Third Div - 309</div>
                  </div>
                </td>
              </tr>

              {/* DINIYAT PAPER II */}
              <tr>
                <td>DINIYAT PAPER - II</td>
                <td>100</td>
                <td className="center-text">{dinII || "0"}</td>
              </tr>

              {/* DINIYAT TOTAL */}
              <tr>
                <td className="bold-text">TOTAL</td>
                <td className="bold-text">200</td>
                <td className="bold-text">66</td>
                <td className="bold-text center-text">{dinTot || "0"}</td>
              </tr>

              {/* URDU */}
              <tr>
                <td>URDU</td>
                <td>100</td>
                <td>30</td>
                <td className="center-text">{urdu || "0"}</td>
              </tr>

              {/* PERSIAN */}
              <tr>
                <td>PERSIAN</td>
                <td>100</td>
                <td>30</td>
                <td className="center-text">{persian || "0"}</td>
              </tr>

              {/* ARABIC */}
              <tr>
                <td>ARABIC</td>
                <td>100</td>
                <td>30</td>
                <td className="center-text">{arabic || "0"}</td>
              </tr>

              {/* HINDI */}
              <tr>
                <td>HINDI</td>
                <td>100</td>
                <td>30</td>
                <td className="center-text">{hindi || "0"}</td>
                {/* Merged Remarks cell for the bottom half */}
                <td rowSpan="5" className="merged-remarks-status">
                  <div className="status-container">
                    <div className="status-row">
                      <div className="status-label">Remarks</div>
                      <div className="status-val">
                        {student.Grace ? `GRACE ${student.Grace}` : ""}
                      </div>
                    </div>
                    <div className="status-row border-top-dash">
                      <div className="status-label">Result</div>
                      <div className="status-val bold-text">{resultStatus}</div>
                    </div>
                    <div className="status-row border-top-dash">
                      <div className="status-label">Division</div>
                      <div className="status-val bold-text">
                        {divisionStatus}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              {/* ENGLISH */}
              <tr>
                <td>ENGLISH</td>
                <td>100</td>
                <td>30</td>
                <td className="center-text">{english || "0"}</td>
              </tr>

              {/* SOCIAL STUDY */}
              <tr>
                <td>SOCIAL STUDY</td>
                <td>100</td>
                <td>30</td>
                <td className="center-text">{sst || "0"}</td>
              </tr>

              {/* MATHEMATICS */}
              <tr>
                <td>MATHEMATICS</td>
                <td>100</td>
                <td>30</td>
                <td className="center-text">{mat || "0"}</td>
              </tr>

              {/* SCIENCE */}
              <tr>
                <td>SCIENCE (Theory+Practical)</td>
                <td className="sci-cell">
                  <div className="sci-split">80+20</div>
                  <div className="sci-total border-top-solid">100</div>
                </td>
                <td className="sci-cell">
                  <div className="sci-split">25+8</div>
                  <div className="sci-total border-top-solid">33</div>
                </td>
                <td className="sci-cell">
                  <div className="sci-split">
                    {sct || scp ? `${sct}+${scp}` : "0"}
                  </div>
                  <div className="sci-total border-top-solid bold-text">
                    {scTot || "0"}
                  </div>
                </td>
              </tr>

              {/* AGGREGATE */}
              <tr className="aggregate-row">
                <td className="bold-text">AGGREGATE</td>
                <td className="bold-text">1000</td>
                <td className="bold-text">309</td>
                <td className="bold-text center-text">{totMs || "0"}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div className="marksheet-words-section">
            <span className="bold-text">In Words :-</span>
            <span className="words-value">{totMsInWords}</span>
          </div>

          <div className="marksheet-footer">
            <div className="footer-date">
              <span className="label">Date of Publication</span>
              <span className="dots">...................................</span>
            </div>
            <div className="footer-sigs">
              <div className="sig-block">
                <span>Asst.</span>
              </div>
              <div className="sig-block">
                <span>C.O.E.</span>
              </div>
            </div>
          </div>
        </div>
      </PrintPaper>
    </div>
  );
}

export default StudentMarksheetPage;
