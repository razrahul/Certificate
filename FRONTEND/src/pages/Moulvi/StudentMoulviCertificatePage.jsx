import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markCertificatePrinted } from "../../redux/reducer/certificateSlice";
import {
  divisionFromCode,
  formatDate,
  getYearFromRecord,
  makeCertificateNumber,
  getClassStandardDisplayName,
  getUrduTitleText,
  getUrduYear
} from "../../utils/certificate";
import PrintPaper from "../../components/PrintPaper/PrintPaper";
import { getPublicationDate, getMoulviSubjects } from "../../utils/subject";
import "./StudentMoulviCertificatePage.scss";

function StudentMoulviCertificatePage({ onRouteChange }) {
  const dispatch = useDispatch();
  const student = useSelector((state) => state.certificate.searchResult);
  const [showBackground, setShowBackground] = useState(true);

  if (!student) {
    return (
      <div className="student-moulvi-certificate-page empty-record-page">
        <h1>Certificate not found</h1>
        <p>Pehle search page par student record search karein.</p>
        <button onClick={() => onRouteChange("certificate")} type="button">
          Go to Search
        </button>
      </div>
    );
  }

  // Parse dynamic subjects to calculate aggregate total marks for division lookup
  const { compulsory, optional } = getMoulviSubjects(student);
  
  // Sum up compulsory and optional marks to get dynamic totalobtained
  let totalObtained = 0;
  compulsory.forEach(s => {
    totalObtained += Number(s.total || 0);
  });
  // Optional subjects also add to total obtained
  const opt1 = student.OPT1Gr && student.OPT1Gr !== "." ? Number(student.OPT1 || 0) + Number(student.OPT1Gr) : Number(student.OPT1 || 0);
  const opt2 = student.OPT2_Tot ? Number(student.OPT2_Tot) + (student.OPT2Gr && student.OPT2Gr !== "." ? Number(student.OPT2Gr) : 0) : 0;
  const opt3 = student.OPT3_Tot ? Number(student.OPT3_Tot) + (student.OPT3Gr && student.OPT3Gr !== "." ? Number(student.OPT3Gr) : 0) : 0;
  const opt4 = student.OPT4_Tot ? Number(student.OPT4_Tot) + (student.OPT4Gr && student.OPT4Gr !== "." ? Number(student.OPT4Gr) : 0) : 0;
  totalObtained += (opt1 + opt2 + opt3 + opt4);

  const divisionName = divisionFromCode(student.Div, totalObtained || student.TotMs);
  const examYear = getYearFromRecord(student);
  const streamName = String(student.Stream || "").toUpperCase().trim();
  const classInfo = getClassStandardDisplayName(student.Class || "MOULVI");

  // Create list of compulsory subjects for certificate text
  const subjectsList = [];
  let addedDiniyat = false;
  compulsory.forEach(s => {
    const name = s.name.toUpperCase().trim();
    if (name.includes("DINIYAT")) {
      if (!addedDiniyat) {
        subjectsList.push("DINIYAT");
        addedDiniyat = true;
      }
    } else {
      subjectsList.push(name);
    }
  });

  const formattedSubjects = subjectsList.length > 0
    ? subjectsList.slice(0, -1).join(", ") + (subjectsList.length > 1 ? " & " : "") + subjectsList[subjectsList.length - 1]
    : "";

  // Create list of optional subjects for certificate text
  const optSubjectsList = optional.map(s => s.name.toUpperCase().trim());
  const formattedOptionalSubjects = optSubjectsList.length > 0
    ? optSubjectsList.slice(0, -1).join(", ") + (optSubjectsList.length > 1 ? " & " : "") + optSubjectsList[optSubjectsList.length - 1]
    : "";

  const handlePrint = () => {
    dispatch(markCertificatePrinted(student.id));
    window.print();
  };

  return (
    <div className="student-moulvi-certificate-page">
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
        {/* Certificate Number overlay */}
        <div className="moulvi-cert-no-overlay">
          <span className="moulvi-cert-label">Cert.No.:</span>
          <div className="moulvi-dotted-line-fill cert-no-line">
            <span className="moulvi-cert-value">
              {student.MsNo || student.SlNo || makeCertificateNumber(student)}
            </span>
          </div>
        </div>

        {/* Outer content container */}
        <div className="moulvi-certificate-content">
          <div className="header-padding"></div>

          {/* Exam Title & Year */}
          <div className="moulvi-cert-title-section">
            <div className="moulvi-cert-urdu-title">
              {getUrduTitleText(classInfo.name, streamName)} {getUrduYear(student.year || "2026")}
            </div>
            <h2 className="moulvi-cert-title">
              CERTIFICATE FOR  {classInfo.name}
              {classInfo.suffixNumber && (
                <>
                  ({classInfo.suffixNumber}
                  <sup>{classInfo.suffixText}</sup>)
                </>
              )}{" "} <i>{streamName}</i> EXAMINATION
              <span className="year-value-dotted">
                {student.year || "2026"}
              </span>
            </h2>
          </div>

          <div className="moulvi-cert-body-lines">
            {/* Row 1: Candidate Name */}
            <div className="moulvi-cert-line-row">
              <span className="moulvi-cert-label certify-label">This is to certify that</span>
              <div className="moulvi-dotted-line-fill name-line">
                <span className="moulvi-faq-value name-value">
                  {student.studentName || student.Name || ""}
                </span>
              </div>
            </div>

            {/* Row 2: Father Name */}
            <div className="moulvi-cert-line-row">
              <span className="moulvi-cert-label father-label">Father's Name</span>
              <div className="moulvi-dotted-line-fill father-line">
                <span className="moulvi-faq-value">
                  {student.fatherName || student.Father || ""}
                </span>
              </div>
            </div>

            {/* Row 3: Mother Name */}
            <div className="moulvi-cert-line-row">
              <span className="moulvi-cert-label mother-label">Mother's Name</span>
              <div className="moulvi-dotted-line-fill mother-line">
                <span className="moulvi-faq-value">
                  {student.motherName || student.Mother || ""}
                </span>
              </div>
              <span className="moulvi-cert-label bearing-label">Bearing</span>
            </div>


            {/* Row 5: Roll No with Code & Registration No */}
            <div className="moulvi-cert-line-row split-row roll-reg-row">
              <span className="moulvi-cert-label roll-label">Roll No. with Code</span>
              <div className="moulvi-dotted-line-fill roll-line">
                <span className="moulvi-faq-value">
                  {student.rollNo || student.RollNo || ""}
                </span>
              </div>
              <span className="moulvi-cert-label reg-label">Registration No</span>
              <div className="moulvi-dotted-line-fill reg-line">
                <span className="moulvi-faq-value">
                  {student.registrationNo || student.Rgn || ""}
                </span>
              </div>
            </div>

            {/* Row 6: className and examination placed */}
            <div className="moulvi-cert-line-row passed-exam-row">
              <span className="moulvi-cert-label passed-label">passed</span>
              <span className="class-highlight-label">
                {classInfo.name.toUpperCase()}
                {classInfo.suffixNumber && (
                  <>
                    ({classInfo.suffixNumber.toUpperCase()}
                    <sup>{classInfo.suffixText}</sup>)
                  </>
                )}{" "}
                {streamName}
              </span>
              <span className="moulvi-cert-label placed-label">Examination and was placed</span>
            </div>

            {/* Row 7: Division & Year */}
            <div className="moulvi-cert-line-row split-row div-year-row">
              <span className="moulvi-cert-label in-the-label">in the</span>
              <div className="moulvi-dotted-line-fill division-line">
                <span className="moulvi-faq-value uppercase-text">
                  {divisionName ? divisionName.toUpperCase() : ""}
                </span>
              </div>
              <span className="moulvi-cert-label div-suffix-label">Division, in the year</span>
              <div className="moulvi-dotted-line-fill year-line">
                <span className="moulvi-faq-value">{student.year || "2026"}</span>
              </div>
              <span className="moulvi-cert-label from-madrasa-label">from Madrasa :</span>
            </div>

            {/* Row 8: Madrasa Name */}
            <div className="moulvi-cert-line-row madrasa-name-row">
              <div className="moulvi-dotted-line-fill full-width-line">
                <span className="moulvi-faq-value madrasa-value">
                  {student.madrasaName || student.Madrasa || student.NomMad || ""}
                </span>
              </div>
            </div>

            {/* Row 9: Compulsory Subjects list */}
            <div className="moulvi-cert-line-row subjects-row">
              <span className="moulvi-cert-label subjects-label">Compulsory Subjects : </span>
              <div className="subjects-value-container">
                <span className="moulvi-faq-value subjects-value">{formattedSubjects}</span>
              </div>
            </div>

            {/* Row 10: Optional Subjects list */}
            <div className="moulvi-cert-line-row subjects-row optional-subjects-row">
              <span className="moulvi-cert-label subjects-label">Optional Subjects : </span>
              <div className="subjects-value-container">
                <span className="moulvi-faq-value subjects-value">{formattedOptionalSubjects}</span>
              </div>
            </div>
          </div>

          {/* Footer publication dates & sigs */}
          <div className="moulvi-cert-footer">
            <div className="pub-date-box">
              <span className="moulvi-cert-label pub-label">Date of Publication</span>
              <div className="moulvi-dotted-line-fill pub-line">
                <span className="moulvi-faq-value">
                  {formatDate(student.issueDate || getPublicationDate(`MOULVI ${streamName}`, examYear, "certificate"))}
                </span>
              </div>
            </div>
            <div className="moulvi-cert-footer-sigs">
              <div className="moulvi-cert-sig-block date-sig-block">
                <span className="moulvi-cert-sig-lbl">Asst.</span>
              </div>
              <div className="moulvi-cert-sig-block date-sig-block">
                <span className="moulvi-cert-sig-lbl">C.O.E.</span>
              </div>
            </div>
          </div>
        </div>
      </PrintPaper>
    </div>
  );
}

export default StudentMoulviCertificatePage;
