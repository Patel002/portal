import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import showToast from "../../helper/toast";

const emptyShift = (sr = 1) => ({
  sr_no: sr,
  shift_type: "",
  shift_start: "",
  shift_end: "",
  remarks: "",
});

const isShiftFilled = (s) =>
  s.shift_type.trim() !== "" &&
  s.shift_start.trim() !== "" &&
  s.shift_end.trim() !== "";

const Step4 = ({ nextStep, prevStep, handleChange, values }) => {

  const successAudio = new Audio("/assets/success.mp3");
  const errorAudio = new Audio("/assets/error.mp3");

  const [mode, setMode] = useState("manual");
  const [shifts, setShifts] = useState(() => values.shift_pattern || []);


  useEffect(() => {
    if (JSON.stringify(values.shift_pattern) !== JSON.stringify(shifts)) {
      if (handleChange) handleChange("shift_pattern")(shifts);
    }
  }, [shifts]);


  useEffect(() => {
    if (Array.isArray(values.shift_pattern)) setShifts(values.shift_pattern);
  }, [values.shift_pattern]);

  // Add new shift only if last shift is filled (or there are none)
  const addShift = () => {
    if (shifts.length === 0 || isShiftFilled(shifts[shifts.length - 1])) {
      const nextSr = shifts.length + 1;
      setShifts((prev) => [...prev, emptyShift(nextSr)]);
    } else {
      // Could show toast; here we simply prevent add
      // you can replace with showToast if available
      showToast("warning", "Please fill the previous shift before adding a new one.");
    }
  };

  const updateShift = (index, field, value) => {
    setShifts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeShift = (index) => {
    setShifts((prev) => {
      const copy = prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, sr_no: i + 1 }));
      return copy;
    });
  };

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    // read file
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const wsName = wb.SheetNames[0];
    const ws = wb.Sheets[wsName];

    const json = XLSX.utils.sheet_to_json(ws, { defval: "" });

    const parsed = json.map((row, idx) => {
      const get = (...keys) =>
        keys.reduce((acc, k) => acc || row[k] || row[k?.toString?.().toLowerCase?.()] || "", "");
      const shift_pattern = get("Shift Pattern", "shift_pattern", "pattern", "shift", "Pattern");
      const shift_type = get("Shift Type", "shift_type", "Type(1:Fixed Shift Pattern ,2:Emergency/Adhoc Shift Pattern)", "type","Type");
      const shift_start = get("Shift Start", "shift_start", "start_time", "start", "Start date");
      const shift_end = get("Shift End", "shift_end", "end_time", "end", "end date");
      const remarks = get("Remarks", "remarks", "note", "remark", "comments");
      const sr_no = idx + 1;
      return {
        sr_no,
        shift_pattern: String(shift_pattern).toString(),
        shift_type: String(shift_type).toString(),
        shift_start: String(shift_start).toString(),
        shift_end: String(shift_end).toString(),
        remarks: String(remarks).toString(),
      };
    });

    if (parsed.length === 0) {
      showToast("error","No data found in the uploaded file.");
      return;
    }

    setMode("upload");
    setShifts(parsed);
    showToast("success",`File "${file.name}" uploaded successfully with ${parsed.length} records.`);
    successAudio.play().catch(() => {});
  };

  const downloadTemplate = () => {
  const link = document.createElement("a");
  link.href = "/assets/templates/shift_pattern_template.csv"; // path in public folder
  link.download = "shift_pattern_template.csv";
  link.click();
};



  // validate at least one filled shift for enabling Next
  const hasValidShift = shifts.some((s) => isShiftFilled(s));

  // when switching to manual, if no shifts exist add one empty
  useEffect(() => {
    if (mode === "manual" && shifts.length === 0) {
      setShifts([emptyShift(1)]);
    }
  }, [mode]);

  return (
    <div className="step4-form">

      <div className="mb-3">
        <div className="form-check form-check-inline">
          <input
            id="modeManual"
            type="radio"
            name="mode"
            className="form-check-input"
            checked={mode === "manual"}
            onChange={() => setMode("manual")}
          />
          <label htmlFor="modeManual" className="form-check-label">
            Manual Entry
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            id="modeUpload"
            type="radio"
            name="mode"
            className="form-check-input"
            checked={mode === "upload"}
            onChange={() => setMode("upload")}
          />
          <label htmlFor="modeUpload" className="form-check-label">
            Upload File (CSV / XLS / XLSX)
          </label>
        </div>

       <div className="mb-3 d-flex align-items-center">
  <div className="me-2">
    <button
      type="button"
      className="btn btn-outline-success btn-sm"
      onClick={downloadTemplate}
      title="Download CSV template for shift patterns"
    >
      <i className="bi bi-download me-1"></i> Download CSV Template
    </button>
  </div>
  <small className="text-muted">
    Use this template to prepare your shift data for upload.
  </small>
</div>


      </div>

      {mode === "upload" && (
        <div className="card card-body mb-3">
          <div className="mb-2">
            <input
              type="file"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {shifts.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Shift Pattern</th>
                    <th>Shift Type</th>
                    <th>Shift Start</th>
                    <th>Shift End</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((s, i) => (
                    <tr key={i}>
                      <td>{s.sr_no}</td>
                     <td>{s.shift_pattern}</td>
                      <td>{s.shift_type}</td>
                      <td>{s.shift_start}</td>
                      <td>{s.shift_end}</td>
                      <td>{s.remarks}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeShift(i)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <small className="text-muted">Parsed preview — confirm then press Next.</small>
            </div>
          ) : (
            <div className="text-muted">No file uploaded yet.</div>
          )}
        </div>
      )}

      {mode === "manual" && (
        <div className="card card-body mb-3">
          <div>
            {shifts.map((s, idx) => (
              <div className="mb-2" key={idx}>
                <div className="row g-2 align-items-end">
                  <div className="col-md-1">
                    <label className="form-label">Sr</label>
                    <input
                      className="form-control form-control-sm"
                      value={s.sr_no}
                      readOnly
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Shift Pattern</label>
                    <input
                      className="form-control form-control-sm"
                      value={s.shift_pattern}
                      onChange={(e) => updateShift(idx, "shift_pattern", e.target.value)}
                      required
                    />
                  </div>

                 <div className="col-md-2">
                    <label className="form-label">Shift Type</label>
                    <select
                        className="form-control form-control-sm"
                        value={s.shift_type} // controlled value
                        onChange={(e) => updateShift(idx, "shift_type", e.target.value)}
                    >
                        <option value="">-Select-</option>
                        <option value="1">Fixed Shift Pattern</option>
                        <option value="2">Emergency/Adhoc Shift Pattern</option>
                    </select>
                    </div>

                  <div className="col-md-2">
                    <label className="form-label">Start</label>
                    <input
                      type="time"
                      className="form-control form-control-sm"
                      value={s.shift_start}
                      onChange={(e) => updateShift(idx, "shift_start", e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">End</label>
                    <input
                      type="time"
                      className="form-control form-control-sm"
                      value={s.shift_end}
                      onChange={(e) => updateShift(idx, "shift_end", e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Remarks</label>
                    <input
                      className="form-control form-control-sm"
                      value={s.remarks}
                      onChange={(e) => updateShift(idx, "remarks", e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-1 d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => removeShift(idx)}
                      disabled={shifts.length === 1}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2">
            <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={addShift}>
              + Add Shift
            </button>
            <small className="text-muted">You can add multiple shifts. New row appears only after previous is filled.</small>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={prevStep}>
          ← Back
        </button>
        <button
          className="btn btn-primary"
          onClick={nextStep}
          disabled={!hasValidShift}
          title={!hasValidShift ? "Add at least one valid shift before proceeding" : ""}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Step4;
