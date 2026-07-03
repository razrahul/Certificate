
import "./PrintPaper.scss";

function PrintPaper({ children, showBackground = true, type = "marksheet" }) {
  return (
    <section className={`print-paper ${type}-paper ${showBackground ? "show-bg" : "hide-bg"}`}>
      {children}
    </section>
  );
}

export default PrintPaper;
