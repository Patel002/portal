import { useEffect, useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import showToast from "../../helper/toast.js";
import '../../css/ClientReg.css'

export default function Step2({ nextStep, prevStep, values, handleStep2Change, careFacility, clientNeeds }) {

   const Api_base_Url = import.meta.env.VITE_API_BASE;

 const [errors, setErrors] = useState({});
 const [rows, setRows] = useState(values.step2_data?.length ? values.step2_data : [
  {
     id: Date.now(),
      post_code1: values.post_code || "",
      address: values.address_list || "",
      place: values.postal_address || "",
      type: "",
      entity_name: "",
      care_facility: [],
      client_need: [],
      facility_type_contact_name: "",
      facility_contact_landline_no: "",
      facility_contact_mobile_no :"",
      facility_contact_email :"",
      facility_lane_code :"",
      facility_mobile_code :"",
      suggestions: [],
      loading: false,
  },
]);

useEffect(() => {
  handleStep2Change(rows);
}, [rows]);


  const fetchAddresses = async (value, index) => {
    if (value.length < 2) {
      updateRow(index, { suggestions: [] });
      return;
    }

    try {
      updateRow(index, { loading: true });
      const res = await axios.get(`${Api_base_Url}/address/${value}`);
      updateRow(index, { suggestions: res.data.suggestions || [] });
    } catch (err) {
      console.error("Address lookup failed", err);
    } finally {
      updateRow(index, { loading: false });
    }
  };

  const selectAddress = async (id, index) => {
    try {
      const res = await axios.get(`${Api_base_Url}/address/get/${id}`);
      const data = res.data;

      const fullAddress = [
        data.line_1,
        data.town_or_city,
        data.county,
        data.district,
        data.postcode,
      ]
        .filter(Boolean)
        .join(", ");

      updateRow(index, {
        post_code1: data.postcode,
        address: fullAddress,
        place: data.town_or_city,
        suggestions: [],
      });
    } catch (err) {
      console.error("Failed to fetch address details", err);
    }
  };

  const updateRow = (index, updatedValues) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...updatedValues } : row))
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        post_code1: "",
        address: "",
        place: "",
        entity_name: "",
        care_facility: [],
        client_need: [],
        facility_type_contact_name: "",
        facility_contact_landline_no: "",
        facility_contact_mobile_no :"",
        facility_contact_email :"",
        facility_lane_code :"",
        facility_mobile_code :"",
        suggestions: [],
        loading: false,
      },
    ]);
  };

  const removeRow = (index) => {
    if (index === 0) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

const handleInputChange = (index, field, value) => {
  updateRow(index, { [field]: value });
  if (field === "post_code1") fetchAddresses(value, index);
};

const validateForm = () => {
  const newErrors = {};

  rows.forEach((row, i) => {
    const prefix = `Row ${i + 1}`;
    if (!row.post_code1) newErrors[`post_code1_${i}`] = `${prefix}: Postcode is required`;
    if (!row.address) newErrors[`address_${i}`] = `${prefix}: Address is required`;
    if (!row.place) newErrors[`place_${i}`] = `${prefix}: Place is required`;
    if (!row.type) newErrors[`type_${i}`] = `${prefix}: Address type is required`;
    if (!row.entity_name) newErrors[`entity_name_${i}`] = `${prefix}: Entity name is required`;
    if (!row.client_need?.length) newErrors[`client_need_${i}`] = `${prefix}: Select at least one client need`;
    if (!row.care_facility) newErrors[`care_facility_${i}`] = `${prefix}: Select care facility`;
    if (!row.facility_type_contact_name) newErrors[`facility_type_contact_name_${i}`] = `${prefix}: Contact name is required`;
    if (!row.facility_contact_landline_no) newErrors[`facility_contact_landline_no_${i}`] = `${prefix}: Landline number is required`;
    if (!row.facility_contact_mobile_no) newErrors[`facility_contact_mobile_no_${i}`] = `${prefix}: Mobile number is required`;
    if (!row.facility_contact_email) newErrors[`facility_contact_email_${i}`] = `${prefix}: Email is required`;
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
    showToast("warning", "Please fill all the required fields.");
    return;
  }
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
        <h6>Walsons UK Ltd - Locations of presence with Entities, Care Facilities and Contact Details</h6>
      {rows.map((row, index) => (
        <div key={row.id} className="border p-3 mb-3 rounded">
             <div className="row mb-2">
            {/* Postcode */}
            <div className="col-md-2 col-sm-4 mb-2">
              <label className="form-label">Postcode <i className="text-danger">*</i></label>
              <input
                type="text"
                className={`form-control ${errors[`post_code1_${index}`] ? "is-invalid" : row.post_code1 ? "is-valid" : ""}`}
                value={row.post_code1}
                onChange={(e) => handleInputChange(index, "post_code1", e.target.value)}
                // readOnly={index === 0}
              />
              {row.suggestions.length > 0 && (
                <ul
                  className="list-group position-absolute w-100 shadow"
                  style={{ zIndex: 1000, maxHeight: "150px", overflowY: "auto" }}
                >
                  {row.suggestions.map((s) => (
                    <li
                      key={s.id}
                      className="list-group-item list-group-item-action"
                      onClick={() => selectAddress(s.id, index)}
                      style={{ cursor: "pointer" }}
                    >
                      {s.address}
                    </li>
                  ))}
                </ul>
              )}
              {row.loading && <div className="form-text">Searching...</div>}
            </div>

            {/* Place */}
            <div className="col-md-3 col-sm-4 mb-2">
              <label className="form-label">Place <i className="text-danger">*</i></label>
              <input
                type="text"
                className={`form-control ${errors[`place${index}`] ? "is-invalid" : row.place ? "is-valid" : ""}`}
                value={row.address}
                onChange={(e) => handleInputChange(index, "place", e.target.value)}
                // readOnly={index === 0}
              />
            </div>

            <div className="col-md-4 col-sm-6 mb-2">
              <label className="form-label">Full Address <i className="text-danger">*</i></label>
              <input
                type="text"
                className={`form-control ${errors[`address_${index}`] ? "is-invalid" : row.address ? "is-valid" : ""}`}
                value={row.place}
                onChange={(e) => handleInputChange(index, "address", e.target.value)}
                // readOnly={index === 0}
              />
            </div>

            <div className="col-md-3 col-sm-6 mb-2">
              <label className="form-label">Address Type <i className="text-danger">*</i></label>
              <select name="type" 
              className={`form-control ${errors[`type_${index}`] ? "is-invalid" : row.type ? "is-valid" : ""}`}
              value={row.type} 
              onChange={(e) => handleInputChange(index, "type", e.target.value)} 
              required >
                <option value="">-Select-</option>
                <option value="Head Office">Head Office</option>
                <option value="Subsidiary">Subsidiary</option>
              </select>
            </div>
             </div>

          <div className="row mb-2">
            <div className="col-md-3 col-sm-6 mb-2">
              <label className="form-label">Entity Name <i className="text-danger">*</i></label>
                <input
                type="text"
                 className={`form-control ${errors[`entity_name_${index}`] ? "is-invalid" : row.entity_name ? "is-valid" : ""}`}
                value={row.entity_name}
                onChange={(e) => handleInputChange(index, "entity_name", e.target.value)}
                required
                />
            </div>

            {/* Need Dropdown */}
            <div className="col-md-3 col-sm-6 mb-2">
            <label className="form-label ">Client Need <i className="text-danger">*</i></label>
            <Select
                isMulti
                options={(clientNeeds || []).map((n) => ({
                value: n.id,
                label: n.name,
                }))}
                value={row.client_need.map((id) => {
                const found = clientNeeds.find((n) => n.id === id);
                return found ? { value: found.id, label: found.name } : null;
                }).filter(Boolean)}
                onChange={(selectedOptions) => {
                const selectedIds = selectedOptions ? selectedOptions.map((o) => o.value) : [];
                handleInputChange(index, "client_need", selectedIds);
                }}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Client Needs"
                  styles={{
                    control: (base, state) => ({
                    ...base,
                    borderColor: errors[`client_need_${index}`]
                        ? "red"
                        : row.client_need.length
                        ? "green"
                        : base.borderColor,
                    boxShadow: "none",
                    "&:hover": {
                        borderColor: errors[`client_need_${index}`]
                        ? "red"
                        : row.client_need.length
                        ? "green"
                        : base.borderColor,
                    },
                    }),
                }}
            />
            </div>


            <div className="col-md-3 col-sm-6 mb-2">
              <label className="form-label">Care Facility Type <i className="text-danger">*</i></label>
              <select
               className={`form-control ${
                errors[`care_facility_${index}`] ? "is-invalid" : (row.care_facility && row.care_facility.length > 0) ? "is-valid" : ""
                }`}

                value={row.care_facility}
                onChange={(e) => handleInputChange(index, "care_facility", e.target.value)}
              >
                <option value="">Select Facility</option>
                {(careFacility || []).map((f, i) => (
                  <option key={i} value={f.id}>{f.facility_name}</option>
                ))}
              </select>
            </div>

             <div className="col-md-3 col-sm-6 mb-2">
              <label className="form-label">Facility Type Contact Name</label>
                <input
                type="text"
                className={`form-control ${errors[`facility_type_contact_name_${index}`] ? "is-invalid" : row.facility_type_contact_name ? "is-valid" : ""}`}
                value={row.facility_type_contact_name}
                onChange={(e) => handleInputChange(index, "facility_type_contact_name", e.target.value)}
                required
                />
            </div>
          </div>

          <div className="row mb-2">
            
            {/* Landline */}
            <div className="col-md-4 col-sm-6 mb-2">
              <label className="form-label">Facility Contact Landline No <i className="text-danger">*</i></label>
              <PhoneInput
                country={"gb"}
                value={row.facility_contact_landline_no}
                onChange={(phone, countryData) => {
                handleInputChange(index, "facility_contact_landline_no", phone);
                handleInputChange(index, "facility_lane_code", countryData.dialCode);
                }}
                inputProps={{ className: "form-control" }}
              />
            </div>

            {/* Mobile */}
            <div className="col-md-4 col-sm-6 mb-2">
              <label className="form-label">Facility Contact Mobile No <i className="text-danger">*</i></label>
              <PhoneInput
                country={"gb"}
                value={row.facility_contact_mobile_no}
                 onChange={(phone, countryData) => {
                handleInputChange(index, "facility_contact_mobile_no", phone);
                handleInputChange(index, "facility_mobile_code", countryData.dialCode);
                }}
                inputProps={{ className: "form-control" }}
              />
            </div>

            {/* Email */}
            <div className="col-md-4 col-sm-6 mb-2">
              <label className="form-label"> Facility Contact Email <i className="text-danger">*</i></label>
              <input
                type="email"
                className={`form-control ${errors[`facility_contact_email_${index}`] ? "is-invalid" : row.facility_contact_email ? "is-valid" : ""}`}
                value={row.facility_contact_email}
                onChange={(e) => handleInputChange(index, "facility_contact_email", e.target.value)}
              />
            </div>
          </div>

          {/* Delete Button */}
          {index !== 0 && (
            <button
              type="button"
              className="btn btn-danger btn-sm mb-2"
              onClick={() => removeRow(index)}
            >
              Delete Entry
            </button>
          )}

          <hr />
        </div>
      ))}


     <div className="d-flex justify-content-between align-items-center mb-3">
  <div>
    <button
      type="button"
      className="btn btn-secondary me-2"
      onClick={prevStep}
    >
       ← Back
    </button>
  </div>

  {/* Right Side: Add & Next Buttons */}
  <div>
    <button
      type="button"
      className="btn btn-warning me-2"
      onClick={addRow}
    >
      Add
    </button>
    <button type="submit" className="btn btn-primary">
      Next
    </button>
  </div>
</div>

    </form>
  );
}
