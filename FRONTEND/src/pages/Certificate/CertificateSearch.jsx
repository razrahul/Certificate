import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCertificateAction } from "../../redux/action/certificateAction";
import {
  classOptions,
  districtOptions,
  divisionFromCode,
  getTotalMarks,
  searchByOptions,
  yearOptions,
} from "../../utils/certificate";
import "./CertificateSearch.scss";

const initialSearch = {
  year: yearOptions[0],
  standard: "Fauquania",
  district: districtOptions[0],
  searchBy: searchByOptions[0].value,
  searchValue: "",
};

const displayValue = (value) => value || "Not available";

function CertificateSearch({ onRouteChange }) {
  const dispatch = useDispatch();
  const { error, searchResult, searchStatus } = useSelector(
    (state) => state.certificate,
  );
  const [filters, setFilters] = useState(initialSearch);
  const isLoading = searchStatus === "loading";
  const previewRecord = useMemo(() => searchResult, [searchResult]);

  const handleChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(searchCertificateAction(filters));
  };

  const totalObtained = getTotalMarks(previewRecord);

  return (
    <div className="certificate-page certificate-lookup-page">
      <section className="certificate-message">
        <p>
          Search BSMEB student records by year, standard, district, and
          Registration No./Roll No. to instantly view student details,
          marksheet, and certificate in a print-ready format.
        </p>
      </section>

      <section className="search-tray">
        <h2>Search T.R :-</h2>
        <form className="lookup-form" onSubmit={handleSubmit}>
          <select
            aria-label="Year"
            value={filters.year}
            onChange={(event) => handleChange("year", event.target.value)}
          >
            {yearOptions.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
          <select
            aria-label="Standard"
            value={filters.standard}
            onChange={(event) => handleChange("standard", event.target.value)}
          >
            {classOptions.map((standard) => (
              <option key={standard}>{standard}</option>
            ))}
          </select>
          <select
            aria-label="District"
            value={filters.district}
            onChange={(event) => handleChange("district", event.target.value)}
          >
            {districtOptions.map((district) => (
              <option key={district}>{district}</option>
            ))}
          </select>
          <select
            aria-label="Search by"
            value={filters.searchBy}
            onChange={(event) => handleChange("searchBy", event.target.value)}
          >
            {searchByOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            aria-label="Search number"
            placeholder={
              filters.searchBy === "registrationNo" ? "Reg No" : "Roll No"
            }
            required
            value={filters.searchValue}
            onChange={(event) =>
              handleChange("searchValue", event.target.value)
            }
          />
          <button disabled={isLoading} type="submit">
            {isLoading ? "Searching" : "Search"}
          </button>
        </form>
        {error ? <p className="form-error">{error}</p> : null}
      </section>

      {previewRecord ? (
        <section className="lookup-result">
          <h2>Results :-</h2>
          <article className="student-result-card">
            <div className="result-grid">
              <span>Name : {displayValue(previewRecord.studentName)}</span>
              <span>
                Father Name : {displayValue(previewRecord.fatherName)}
              </span>
              <span>
                Mother Name : {displayValue(previewRecord.motherName)}
              </span>
              <span>
                Reg No :- {displayValue(previewRecord.registrationNo)}
              </span>
              <span>Roll No :- {displayValue(previewRecord.rollNo)}</span>
              <span>
                Standard/Year :- {displayValue(previewRecord.className)} /{" "}
                {displayValue(previewRecord.year)}
              </span>
              <span>District : {displayValue(previewRecord.district)}</span>
              <span>Total No : {displayValue(totalObtained)}</span>
              <span>
                Division : {divisionFromCode(previewRecord.Div, totalObtained)}
              </span>
            </div>
            <div className="result-actions">
              <button
                className="result-action-primary"
                onClick={() => onRouteChange("student")}
                type="button"
              >
                View
              </button>
              <button
                onClick={() => onRouteChange("studentMarksheet")}
                type="button"
              >
                Marksheet
              </button>
              <button
                onClick={() => {
                  onRouteChange("studentCertificate");
                }}
                type="button"
              >
                Certificate
              </button>
            </div>
          </article>
        </section>
      ) : (
        <section className="lookup-empty-state">
          Search ke baad matching TR record milne par student summary yahan
          dikhaya jayega.
        </section>
      )}
    </div>
  );
}

export default CertificateSearch;
