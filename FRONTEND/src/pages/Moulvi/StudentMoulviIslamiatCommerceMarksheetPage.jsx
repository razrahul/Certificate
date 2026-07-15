import { useState } from "react";
import { useSelector } from "react-redux";
import PrintPaper from "../../components/PrintPaper/PrintPaper";
import {
  divisionFromCode,
  formatDate,
  getYearFromRecord,
  numberToWords,
  getClassStandardDisplayName,
} from "../../utils/certificate";
import { getPublicationDate, getMoulviSubjects } from "../../utils/subject";
import "./StudentMoulviIslamiatCommerceMarksheetPage.scss";

function StudentMoulviIslamiatCommerceMarksheetPage({ onRouteChange }) {
  const student = useSelector((state) => state.certificate.searchResult);
  const [showBackground, setShowBackground] = useState(true);

  if (!student) {
    return (
      <div className="student-moulvi-page empty-record-page">
        <h1>Marksheet not found</h1>
        <p>Pehle search page par student record search karein.</p>
        <button onClick={() => onRouteChange("certificate")} type="button">
          Go to Search
        </button>
      </div>
    );
  }

  // Parse subjects dynamically using our stream-based parser
  const { compulsory, optional } = getMoulviSubjects(student);

  // Diniyat info
  const diniyatSub = compulsory.find((s) => s.isDiniyat) || {};
  const has3Papers =
    diniyatSub.paper3 !== undefined &&
    diniyatSub.paper3 !== null &&
    diniyatSub.paper3 !== "." &&
    diniyatSub.paper3 !== "";
  const diniyatPapers = [
    { name: "DINIYAT PAPER - I", val: diniyatSub.paper1 },
    { name: "DINIYAT PAPER - II", val: diniyatSub.paper2 },
  ];
  if (has3Papers) {
    diniyatPapers.push({ name: "DINIYAT PAPER - III", val: diniyatSub.paper3 });
  }

  // Other compulsory subjects
  const otherCompulsory = compulsory.filter((s) => !s.isDiniyat);

  // Calculate dynamic Full Marks and Pass Marks
  let totalFullMarks = has3Papers ? 300 : 200;
  let totalPassMarks = has3Papers ? 99 : 66;

  otherCompulsory.forEach(() => {
    totalFullMarks += 100;
    totalPassMarks += 30;
  });

  optional.forEach(() => {
    totalFullMarks += 100;
    totalPassMarks += 30;
  });

  const totMs = Number(student.TotMs || student.marks || 0);
  const totMsInWords = numberToWords(totMs);
  const examYear = getYearFromRecord(student);
  const streamName = String(student.Stream || "")
    .toUpperCase()
    .trim();
  const classInfo = getClassStandardDisplayName(
    student.className || student.Class || "MOULVI",
  );

  // Determine Division and Result
  const divName = divisionFromCode(student.Div, totMs);
  const divisionStatus = divName ? divName.toUpperCase() : "-";
  const resultStatus =
    divisionStatus === "PENDING" || divisionStatus === "FAIL" ? "FAIL" : "PASS";

  const distinctionThreshold = Math.round(totalFullMarks * 0.75);
  const firstDivThreshold = Math.round(totalFullMarks * 0.6);
  const secondDivThreshold = Math.round(totalFullMarks * 0.45);
  const thirdDivThreshold = totalPassMarks;

  const compulsoryRows = [];

  // 1. Diniyat paper rows
  diniyatPapers.forEach((paper) => {
    compulsoryRows.push({
      name: paper.name,
      full: 100,
      obt: paper.val || "0",
      type: "diniyat-paper",
    });
  });
  // Diniyat total row
  compulsoryRows.push({
    name: "TOTAL",
    full: has3Papers ? 300 : 200,
    pass: has3Papers ? 99 : 66,
    obt: diniyatSub.total || "0",
    grace: diniyatSub.grace,
    type: "diniyat-total",
  });

  // 2. Other compulsory rows
  otherCompulsory.forEach((sub) => {
    compulsoryRows.push({
      name: sub.name,
      full: 100,
      pass: 30,
      obt: sub.theory || "0",
      grace: sub.grace,
      type: "subject",
    });
  });

  const optionalRows = [];
  // 3. Optional rows
  optional.forEach((sub) => {
    optionalRows.push({
      name: sub.name,
      full: 100,
      pass: 30,
      obt: sub.theory || "0",
      grace: sub.grace,
      type: "subject",
      isPlaceholder: sub.isPlaceholder,
    });
  });

  // Row spans logic
  const rulesRowSpan = 5;

  const getRightColumnCell = (overallIdx, isAggregate = false) => {
    const startIdx = 5;
    if (overallIdx < startIdx) return null; // spanned by rules

    if (isAggregate) {
      return (
        <td className="status-value-cell bold-text division-val-cell">
          {divisionStatus}
        </td>
      );
    }


    if (has3Papers) {
      // Islamiat layout (10 rows total, aggregate at row 10)
      if (overallIdx === 5) {
        return (
          <td className="status-label-cell font-bold remarks-label-cell">
            Remarks
          </td>
        );
      }
      if (overallIdx === 7) {
        return (
          <td className="status-label-cell font-bold result-label-cell">
            Result
          </td>
        );
      }
      if (overallIdx === 8) {
        return (
          <td className="status-value-cell bold-text result-val-cell">
            {resultStatus}
          </td>
        );
      }
      if (overallIdx === 10) {
        return (
          <td className="status-label-cell font-bold division-label-cell">
            Division
          </td>
        );
      }
    } else {
      // Commerce layout (11 rows total, aggregate at row 11)
      if (overallIdx === 5) {
        return (
          <td className="status-label-cell font-bold remarks-label-cell">
            Remarks
          </td>
        );
      }
      if (overallIdx === 7) {
        return (
          <td className="status-label-cell font-bold result-label-cell">
            Result
          </td>
        );
      }
      if (overallIdx === 8) {
        return (
          <td className="status-value-cell bold-text result-val-cell">
            {resultStatus}
          </td>
        );
      }
      if (overallIdx === 10) {
        return (
          <td className="status-label-cell font-bold division-label-cell">
            Division
          </td>
        );
      }
    }
    return <td className="status-empty-cell"></td>;
  };

  return (
    <div className="student-moulvi-page islamiat-commerce-marksheet">
      <div className="print-toolbar">
        <label className="toggle-bg-label">
          <input
            type="checkbox"
            checked={showBackground}
            onChange={(e) => setShowBackground(e.target.checked)}
          />
          Show Template Background here Islamiyat and Commernce
        </label>
        <button onClick={() => onRouteChange("certificate")} type="button">
          Back
        </button>
        <button onClick={() => window.print()} type="button">
          Print Marksheet
        </button>
      </div>

      <PrintPaper showBackground={showBackground} type="marksheet">
        {/* Absolute positioned MS No overlay */}
        <div className="moulvi-ms-no-overlay">
          <span>MS.NO. : {student.MsNo || student.SlNo || ""}</span>
        </div>

        <div className="moulvi-marksheet-content">
          <div className="header-padding"></div>

          <h2 className="moulvi-exam-title">
            MARKS SHEET FOR {classInfo.name}
            {classInfo.suffixNumber && (
              <>
                ({classInfo.suffixNumber}
                <sup>{classInfo.suffixText}</sup>)
              </>
            )}{" "}
            <i>{streamName}</i> EXAMINATION {examYear}
          </h2>

          <div className="moulvi-student-info-section">
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
                  {student.fatherName ||
                    student.Father ||
                    student.FatherName ||
                    ""}
                </span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-cell full-width">
                <span className="label">MOTHER'S NAME</span>
                <span className="dots">:</span>
                <span className="value">
                  {student.motherName ||
                    student.Mother ||
                    student.MotherName ||
                    ""}
                </span>
              </div>
            </div>
            <div className="info-row split">
              <div className="info-cell">
                <span className="label">REGISTRATION NO.</span>
                <span className="dots">:</span>
                <span className="value">
                  {student.registrationNo ||
                    student.Rgn ||
                    student.regNo ||
                    student.RegNo ||
                    ""}
                </span>
              </div>
              <div className="info-cell">
                <span className="label">ROLL NO. WITH CODE</span>
                <span className="dots">:</span>
                <span className="value">
                  {student.rollNo || student.RollNo || student.Roll || ""}
                </span>
              </div>
            </div>
            <div className="info-row madrasa-row">
              <div className="info-cell full-width madrasa-cell">
                <span className="label">NAME OF MADRASA</span>
                <span className="dots">:</span>
                <span className="value">
                  {student.madrasaName ||
                    student.Madrasa ||
                    student.NomMad ||
                    ""}
                </span>
              </div>
            </div>
          </div>

          <table className="moulvi-marksheet-table">
            <thead>
              <tr>
                <th className="col-sub">SUBJECTS OFFERED</th>
                <th className="col-full">Full Marks</th>
                <th className="col-pass">Pass Marks</th>
                <th className="col-obt">Marks Obtained</th>
                <th className="col-rem">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {/* Header row for Compulsory */}
              <tr className="section-header-row">
                <td colSpan="4" className="section-title">
                  COMPULSORY SUBJECTS :
                </td>
                <td rowSpan={rulesRowSpan} className="merged-remarks-rules">
                  <div className="rules-content">
                    <strong>MINIMUM MARKS FOR</strong>
                    <div className="rule-item">
                      <span className="rule-name">Distinction</span>
                      <span className="rule-dash">-</span>
                      <span className="rule-val">{distinctionThreshold}</span>
                    </div>
                    <div className="rule-item">
                      <span className="rule-name">First Div</span>
                      <span className="rule-dash">-</span>
                      <span className="rule-val">{firstDivThreshold}</span>
                    </div>
                    <div className="rule-item">
                      <span className="rule-name">Second Div</span>
                      <span className="rule-dash">-</span>
                      <span className="rule-val">{secondDivThreshold}</span>
                    </div>
                    <div className="rule-item">
                      <span className="rule-name">Third Div</span>
                      <span className="rule-dash">-</span>
                      <span className="rule-val">{thirdDivThreshold}</span>
                    </div>
                  </div>
                </td>
              </tr>

              {/* Render compulsory table row items */}
              {compulsoryRows.map((row, idx) => {
                const overallIdx = idx + 1;
                return (
                  <tr
                    key={`comp-${idx}`}
                    className={row.type === "diniyat-total" ? "bold-text" : ""}
                  >
                    <td>{row.name}</td>
                    <td>{row.full}</td>

                    {/* Dynamic Diniyat Pass Marks Spanning */}
                    {row.type === "diniyat-paper" ? (
                      idx === 0 ? (
                        <td
                          rowSpan={diniyatPapers.length}
                          className="merged-pass-marks"
                        >
                          {has3Papers ? 99 : 66}
                        </td>
                      ) : null
                    ) : row.type === "diniyat-total" ? (
                      <td className="bold-text">{row.pass}</td>
                    ) : (
                      <td>{row.pass}</td>
                    )}

                    <td className="center-text">
                      {row.obt}
                      {row.grace ? (
                        <span className="grace-indicator">+{row.grace}</span>
                      ) : (
                        ""
                      )}
                    </td>

                    {getRightColumnCell(overallIdx)}
                  </tr>
                );
              })}

              {/* Header row for Optional */}
              <tr className="section-header-row">
                <td colSpan="4" className="section-title">
                  OPTIONAL SUBJECTS :
                </td>
                {getRightColumnCell(compulsoryRows.length + 1)}
              </tr>

              {/* Render optional table row items */}
              {optionalRows.map((row, idx) => {
                const overallIdx = compulsoryRows.length + 2 + idx;
                return (
                  <tr key={`opt-${idx}`}>
                    <td>{row.name}</td>
                    <td>{row.isPlaceholder ? "" : row.full}</td>
                    <td>{row.isPlaceholder ? "" : row.pass}</td>
                    <td className="center-text">
                      {row.isPlaceholder ? "" : row.obt}
                      {!row.isPlaceholder && row.grace ? (
                        <span className="grace-indicator">+{row.grace}</span>
                      ) : (
                        ""
                      )}
                    </td>

                    {getRightColumnCell(overallIdx)}
                  </tr>
                );
              })}

              {/* AGGREGATE */}
              <tr className="aggregate-row">
                <td className="bold-text">AGGREGATE</td>
                <td className="bold-text">{totalFullMarks}</td>
                <td className="bold-text">{totalPassMarks}</td>
                <td className="bold-text center-text">{totMs || "0"}</td>

                {getRightColumnCell(
                  compulsoryRows.length + 2 + optionalRows.length,
                  true,
                )}
              </tr>
            </tbody>
          </table>

          <div className="moulvi-marksheet-words-section">
            <span className="bold-text">In Words :-</span>
            <span className="words-value">{totMsInWords}</span>
          </div>

          <div className="moulvi-marksheet-footer">
            <div className="footer-date">
              <span className="label">Date of Publication</span>
              <span className="value">
                {formatDate(
                  student.issueDate ||
                    getPublicationDate(
                      `MOULVI ${streamName}`,
                      examYear,
                      "marksheet",
                    ),
                )}
              </span>
            </div>
            <div className="footer-sigs">
              <div className="sig-block">
                <span>Controller of Examination</span>
              </div>
              <div className="sig-block">
                <span>Secretary</span>
              </div>
            </div>
          </div>
        </div>
      </PrintPaper>
    </div>
  );
}

export default StudentMoulviIslamiatCommerceMarksheetPage;
