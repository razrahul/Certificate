import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markCertificatePrinted } from "../../redux/reducer/certificateSlice";
import {
  divisionFromCode,
  formatDate,
  getClassStandardDisplayName,
  getTotalMarks,
  makeCertificateNumber,
} from "../../utils/certificate";
import PrintPaper from "../../components/PrintPaper/PrintPaper";
import { fauquania, getPublicationDate } from "../../utils/subject";
import "./StudentCertificatePage.scss";

function StudentCertificatePage({ onRouteChange }) {
  const dispatch = useDispatch();
  const student = useSelector((state) => state.certificate.searchResult);
  const [showBackground, setShowBackground] = useState(true);

  if (!student) {
    return (
      <div className="student-certificate-page empty-record-page">
        <h1>Certificate not found</h1>
        <p>Pehle certificate page par student record search karein.</p>
        <button onClick={() => onRouteChange("certificate")} type="button">
          Go to Certificate Search
        </button>
      </div>
    );
  }

  const totalObtained = getTotalMarks(student);
  const divisionName = divisionFromCode(student.Div, totalObtained);
  const classInfo = getClassStandardDisplayName(student.className || student.Class);

  // Dynamic formatting of compulsory subjects list with '&' before the last one
  const subjectsList = fauquania.compulsory_subjects || [];
  const formattedSubjects = subjectsList.length > 0
    ? subjectsList.slice(0, -1).join(", ") + " & " + subjectsList[subjectsList.length - 1]
    : "";

  const handlePrint = () => {
    dispatch(markCertificatePrinted(student.id));
    window.print();
  };

  return (
    <div className="student-certificate-page">
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
        <button onClick={handlePrint} type="button">
          Print Certificate
        </button>
      </div>

      <PrintPaper showBackground={showBackground} type="certificate">
        {/* Certificate Number overlay at the top right */}
        <div className="cert-no-overlay">
          <span className="cert-label">Cert.No.:</span>
          <div className="dotted-line-fill cert-no-line">
            <span className="cert-value">
              {student.MsNo || student.SlNo || makeCertificateNumber(student)}
            </span>
          </div>
        </div>

        {/* Outer content container */}
        <div className="certificate-content">
          <div className="header-padding"></div>

          {/* Exam Title & Year */}
          <div className="cert-title-section">
            <h2 className="cert-title">
              CERTIFICATE FOR {classInfo.name}
              {classInfo.suffixNumber && (
                <>
                  ({classInfo.suffixNumber}
                  <sup>{classInfo.suffixText}</sup>)
                </>
              )}{" "}
              EXAMINATION
              <span className="year-value-dotted">
                {student.year || "2026"}
              </span>
            </h2>
          </div>

          <div className="cert-body-lines">
            {/* Row 1: Candidate Name */}
            <div className="cert-line-row">
              <span className="cert-label certify-label">This is to certify that</span>
              <div className="dotted-line-fill name-line">
                <span className="faq-value name-value">
                  {student.studentName || student.Name || ""}
                </span>
              </div>
            </div>

            {/* Row 2: Father Name */}
            <div className="cert-line-row">
              <span className="cert-label father-label">Father's Name</span>
              <div className="dotted-line-fill father-line">
                <span className="faq-value">
                  {student.fatherName || student.Father || ""}
                </span>
              </div>
            </div>

            {/* Row 3: Mother Name */}
            <div className="cert-line-row">
              <span className="cert-label mother-label">Mother's Name</span>
              <div className="dotted-line-fill mother-line">
                <span className="faq-value">
                  {student.motherName || student.Mother || ""}
                </span>
              </div>
            </div>

            {/* Row 4: Born on ... Bearing */}
            <div className="cert-line-row split-row born-row">
              <span className="cert-label born-label">Born on</span>
              <div className="dotted-line-fill dob-line">
                <span className="faq-value">
                  {formatDate(student.dob || student.DOB)}
                </span>
              </div>
              <span className="cert-label bearing-label">Bearing</span>
            </div>

            {/* Row 5: Roll No with Code & Registration No */}
            <div className="cert-line-row split-row roll-reg-row">
              <span className="cert-label roll-label">Roll No. with Code</span>
              <div className="dotted-line-fill roll-line">
                <span className="faq-value">
                  {student.rollNo || student.RollNo || ""}
                </span>
              </div>
              <span className="cert-label reg-label">Registration No</span>
              <div className="dotted-line-fill reg-line">
                <span className="faq-value">
                  {student.registrationNo || student.Rgn || ""}
                </span>
              </div>
            </div>

            {/* Row 6: className and examination placed */}
            <div className="cert-line-row passed-exam-row">
              <span className="cert-label passed-label">passed</span>
              <span className="class-highlight-label">
                {classInfo.name}
                {classInfo.suffixNumber && (
                  <>
                    ({classInfo.suffixNumber}
                    <sup>{classInfo.suffixText}</sup>)
                  </>
                )}
              </span>
              <span className="cert-label placed-label">Examination and was placed</span>
            </div>

            {/* Row 7: placed in the ... Division, in the year ... from Madrasa: */}
            <div className="cert-line-row split-row div-year-row">
              <span className="cert-label in-the-label">in the</span>
              <div className="dotted-line-fill division-line">
                <span className="faq-value uppercase-text">
                  {divisionName ? divisionName.toUpperCase() : ""}
                </span>
              </div>
              <span className="cert-label div-suffix-label">Division, in the year</span>
              <div className="dotted-line-fill year-line">
                <span className="faq-value">{student.year || "2026"}</span>
              </div>
              <span className="cert-label from-madrasa-label">from Madrasa :</span>
            </div>

            {/* Row 8: Madrasa Name */}
            <div className="cert-line-row madrasa-name-row">
              <div className="dotted-line-fill full-width-line">
                <span className="faq-value madrasa-value">
                  {student.madrasaName || student.Madrasa || student.NomMad || ""}
                </span>
              </div>
            </div>

            {/* Row 9: Compulsory Subjects list */}
            <div className="cert-line-row subjects-row">
              <span className="cert-label subjects-label">Compulsory Subjects : </span>
              <div className="subjects-value-container">
                <span className="faq-value subjects-value">{formattedSubjects}</span>
              </div>
            </div>
          </div>

          {/* Footer publication dates & sigs */}
          <div className="cert-footer">
            <div className="pub-date-box">
              <span className="cert-label pub-label">Date of Publication</span>
              <div className="dotted-line-fill pub-line">
                <span className="faq-value">
                  {formatDate(student.issueDate || getPublicationDate(student.className || student.Class, student.year, "certificate"))}
                </span>
              </div>
            </div>

            <div className="sig-box coe-box">
              <span className="cert-label signature-title">C.O.E.</span>
            </div>

            <div className="sig-box secretary-box">
              <span className="cert-label signature-title">Secretary</span>
            </div>
          </div>
        </div>
      </PrintPaper>
    </div>
  );
}

export default StudentCertificatePage;
