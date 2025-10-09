import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import showToast from "../../helper/toast";

const emptyPayRate = (type = "RD", sr = 1) => ({
  sr_no: type === "RD" ? sr : `BH${sr}`,
  regular_day_morning: "",
  regular_day_afternoon: "",
  regular_day_night: "",
  regular_day_weekend_morning: "",
  regular_day_weekend_afternoon: "",
  regular_day_weekend_night: "",
  regular_day_sleep_in: "",
  regular_day_waking_night_weekday: "",
  regular_day_waking_night_weekend: "",
  bank_holiday_morning: "",
  bank_holiday_afternoon: "",
  bank_holiday_night: "",
  bank_holiday_sleep_in: "",
  bank_holiday_waking_night: "",
});

export default function Step5({ handleChange, values, jobTitle, prevStep, submitForm }) {

  const successAudio = new Audio("/assets/success.mp3");
  const errorAudio = new Audio("/assets/error.mp3");

  
  const initialRegularPayRates = values.payrate?.map((p, idx) => ({
    sr_no: idx + 1,
    regular_day_morning: p.regular_day_morning || "",
    regular_day_afternoon: p.regular_day_afternoon || "",
    regular_day_night: p.regular_day_night || "",
    regular_day_weekend_morning: p.regular_day_weekend_morning || "",
    regular_day_weekend_afternoon: p.regular_day_weekend_afternoon || "",
    regular_day_weekend_night: p.regular_day_weekend_night || "",
    regular_day_sleep_in: p.regular_day_sleep_in || "",
    regular_day_waking_night_weekday: p.regular_day_waking_night_weekday || "",
    regular_day_waking_night_weekend: p.regular_day_waking_night_weekend || "",
  }));

  const initialBankHolidayPayRates = values.payrate?.map((p, idx) => ({
    sr_no: `BH${idx + 1}`,
    bank_holiday_morning: p.bank_holiday_morning || "",
    bank_holiday_afternoon: p.bank_holiday_afternoon || "",
    bank_holiday_night: p.bank_holiday_night || "",
    bank_holiday_sleep_in: p.bank_holiday_sleep_in || "",
    bank_holiday_waking_night: p.bank_holiday_waking_night || "",
  }));

  const [regularPayRates, setRegularPayRates] = useState(initialRegularPayRates || [emptyPayRate()]);
  const [bankHolidayPayRates, setBankHolidayPayRates] = useState(initialBankHolidayPayRates || [emptyPayRate("BH")]);

  const [selectedJob, setSelectedJob] = useState(values.payrate?.[0]?.job_title || "");

  
  useEffect(() => {
    if (selectedJob) {
    const combinedRates = regularPayRates.map((rd, idx) => {
      const bh = bankHolidayPayRates[idx] || {};
      return {
        job_title: selectedJob,
        sr_no: rd.sr_no,
        ...bh, 
        ...rd,
      };
    });
      handleChange("payrate")(combinedRates);
    }
  }, [regularPayRates, bankHolidayPayRates, selectedJob]);
  

  const handleFieldChange = (index, field, value, type = "RD") => {
    if (type === "RD") {
      const temp = [...regularPayRates];
      temp[index][field] = value;
      setRegularPayRates(temp);
    } else {
      const temp = [...bankHolidayPayRates];
      temp[index][field] = value;
      setBankHolidayPayRates(temp);
    }
  };

  const addRow = (type = "RD") => {
    if (type === "RD") setRegularPayRates([...regularPayRates, emptyPayRate("RD", regularPayRates.length + 1)]);
    else setBankHolidayPayRates([...bankHolidayPayRates, emptyPayRate("BH", bankHolidayPayRates.length + 1)]);
  };

  const removeRow = (index, type = "RD") => {
    if (type === "RD") {
      const temp = [...regularPayRates];
      temp.splice(index, 1);
      setRegularPayRates(temp.map((p, idx) => ({ ...p, sr_no: idx + 1 })));
    } else {
      const temp = [...bankHolidayPayRates];
      temp.splice(index, 1);
      setBankHolidayPayRates(temp.map((p, idx) => ({ ...p, sr_no: `BH${idx + 1}` })));
    }
  };

 const handleFile = async (file) => {
  if (!file) return;
  try {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const ws = wb.Sheets[wb.SheetNames[0]];

    const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    if (raw.length < 2) {
      showToast("error", "No data found in uploaded file.");
      return;
    }

    const headers = raw[1]; 
    const values = raw.slice(2); 

    const regular = [];
    const bh = [];

    values.forEach((row, idx) => {
      const rd = { sr_no: idx + 1 };
      const bhRow = { sr_no: `BH${idx + 1}` };

      headers.forEach((header, colIdx) => {
        const val = row[colIdx]?.toString().replace("£", "").trim() || "";

        if (colIdx >= 1 && colIdx <= 9) {
          switch (header) {
            case "Morning":
              rd.regular_day_morning = val;
              break;
            case "Afternoon":
              rd.regular_day_afternoon = val;
              break;
            case "Night":
              rd.regular_day_night = val;
              break;
            case "weekend morning":
              rd.regular_day_weekend_morning = val;
              break;
            case "weekend afternoon":
              rd.regular_day_weekend_afternoon = val;
              break;
            case "weekend night":
              rd.regular_day_weekend_night = val;
              break;
            case "sleep in":
              rd.regular_day_sleep_in = val;
              break;
            case "waking night weekday":
              rd.regular_day_waking_night_weekday = val;
              break;
            case "waking night weekend":
              rd.regular_day_waking_night_weekend = val;
              break;
            default:
              break;
          }
        }
    
        if (colIdx >= 9) {
          switch (header) {
            case "Morning":
              bhRow.bank_holiday_morning = val;
              break;
            case "Afternoon":
              bhRow.bank_holiday_afternoon = val;
              break;
            case "Night":
              bhRow.bank_holiday_night = val;
              break;
            case "Sleep in":
              bhRow.bank_holiday_sleep_in = val;
              break;
            case "Waking Night":
              bhRow.bank_holiday_waking_night = val;
              break;
            default:
              break;
          }
        }
      });

      regular.push(rd);
      bh.push(bhRow);
    });

    setRegularPayRates(regular);
    setBankHolidayPayRates(bh);
    showToast("success", "Pay rates loaded from Excel.");
    successAudio.play().catch(() => {});
  } catch (err) {
    console.error(err);
    showToast("error", "Failed to read Excel file.");
    errorAudio.play().catch(() => {});
  }
};


  const downloadTemplate = () => {
    const template = [...regularPayRates, ...bankHolidayPayRates];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "pay_rate_template.xlsx");
  };

  return (
    <div className="step5-form">
      <h6 className="mb-2"></h6>
      <select
        className="form-control mb-3"
        value={selectedJob}
        onChange={(e) => {
        const val = e.target.value;
        setSelectedJob(val);

    if (!values.payrate?.some(p => p.job_title === val)) {
      setRegularPayRates([emptyPayRate()]);
      setBankHolidayPayRates([emptyPayRate("BH")]);
    }

    }}

      >
        <option value="">--Select Job Title--</option>
        {jobTitle.map((job) => (
          <option key={job.id} value={job.id}>
            {job.name}
          </option>
        ))}
      </select>

      {selectedJob && (
        <>
          {/* Regular Day Table */}
          <h6>Regular Day Rates</h6>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>SR</th>
                <th>Morning</th>
                <th>Afternoon</th>
                <th>Night</th>
                <th>Weekend Morning</th>
                <th>Weekend Afternoon</th>
                <th>Weekend Night</th>
                <th>Sleep In</th>
                <th>Waking Night Weekday</th>
                <th>Waking Night Weekend</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {regularPayRates.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.sr_no}</td>
                  {["regular_day_morning","regular_day_afternoon","regular_day_night","regular_day_weekend_morning","regular_day_weekend_afternoon","regular_day_weekend_night","regular_day_sleep_in","regular_day_waking_night_weekday","regular_day_waking_night_weekend"].map((field) => (
                    <td key={field}>
                      <input
                        type="number"
                        value={p[field]}
                        onChange={(e) => handleFieldChange(idx, field, e.target.value, "RD")}
                        className="form-control form-control-sm"
                      />
                    </td>
                  ))}
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => removeRow(idx, "RD")}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <button className="btn btn-sm btn-primary mb-2" onClick={() => addRow("RD")}>Add Row</button> */}

          {/* Bank Holiday Table */}
          <h6>Bank Holiday Rates</h6>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>SR</th>
                <th>Morning</th>
                <th>Afternoon</th>
                <th>Night</th>
                <th>Sleep In</th>
                <th>Waking Night</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bankHolidayPayRates.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.sr_no}</td>
                  {["bank_holiday_morning","bank_holiday_afternoon","bank_holiday_night","bank_holiday_sleep_in","bank_holiday_waking_night"].map((field) => (
                    <td key={field}>
                      <input
                        type="number"
                        value={p[field]}
                        onChange={(e) => handleFieldChange(idx, field, e.target.value, "BH")}
                        className="form-control form-control-sm"
                      />
                    </td>
                  ))}
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => removeRow(idx, "BH")}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <button className="btn btn-sm btn-primary mb-2" onClick={() => addRow("BH")}>Add Row</button> */}

          <div className="mb-3 d-flex align-items-center">
            <input
              type="file"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <button className="btn btn-outline-success btn-sm ms-2" onClick={downloadTemplate}>
              Download Template
            </button>
          </div>
        </>
      )}

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={prevStep}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={submitForm} disabled={!selectedJob}>
          submit →
        </button>
      </div>
    </div>
  );
}
