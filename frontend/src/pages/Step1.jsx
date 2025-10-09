import { useState, useEffect } from "react";
import axios from "axios";

export default function Step1({ nextStep, handleChange, values, countryCodes }) {
  
   const Api_base_Url = import.meta.env.VITE_API_BASE;

  const [hasOtherPassport, setHasOtherPassport] = useState(values.passport === "Other");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const today = new Date();
  const minDate = new Date(today.getFullYear() - 110, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());  
  const formatDate = (date) => date.toISOString().split("T")[0];

  const validators = {
    candidate_name: (val) => val.trim().length >= 2,
    email_id: (val) => /^\S+@\S+\.\S+$/.test(val),
    post_code: (val) => val.trim().length >= 4,
    address_line_1: (val) => val.trim().length > 5,
    place: (val) => val.trim().length > 2,
    countryCode: (val) => val !== "" && val !== undefined,
    mobile_number: (val) => /^[0-9]{10,15}$/.test(val),
    candidate_dob: (val) => !!val,
    passport: (val) => val !== "" && val !== undefined,
    other_passport: (val) => !hasOtherPassport || (val !== "" && val !== undefined),
    is_visa_for_uk: (val) => !(hasOtherPassport && val === "No"),
  };

    const handlePassportChange = (e) => {
    const value = e.target.value;
    handleChange("passport")(e);
    setHasOtherPassport(value === "Other");
  };


    const isValid = (field, value) => {
    if (!validators[field]) return true;
    return validators[field](value);
  };

   const handleSubmit = (e) => {
  e.preventDefault();

  const allValid = Object.keys(validators).every((field) =>
    isValid(field, values[field] || "")
  );
  

  console.log("Form values at submit:", values);
console.log("Validation results:", 
  Object.keys(validators).map(f => ({ field: f, value: values[f], valid: isValid(f, values[f] || "") }))
);


  if (!allValid) {
    setTouched(
      Object.keys(validators).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );
    return;
  }

  nextStep();
};


 const getClass = (field, value) => {
  if (!touched[field]) return "form-control";
  return `form-control ${isValid(field, value) ? "is-valid" : "is-invalid"}`;
};



//   const baseUrl = import.meta.env.API_BASE

useEffect(() => {
  if (values.place !== undefined) {
    // setPlace(values.place);
  }
}, [values.place]);

  const fetchAddresses = async (value) => {
    // setPostcode(value);
    // handleChange("post_code")({ target: { value } });

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }


    try {
      setLoading(true);
      const res = await axios.get(`${Api_base_Url}/address/${value}`);
      
      setSuggestions(res.data.suggestions || []);

      // console.log('passcode',setPostcode);
    } catch (err) {
      console.error("Address lookup failed", err);
    } finally {
      setLoading(false);
    }
  };

   const selectAddress = async (id) => {
    try {
      const res = await axios.get(`${Api_base_Url}/address/get/${id}`);
      const data = res.data;

      const fullAddress = [
        data.line_1,
        data.town_or_city,
        data.county,
        data.district,
        data.postcode
      ]
        .filter(Boolean)
        .join(", ");

      // setAddress(fullAddress);
      // setPostcode(data.postcode);
      // setPlace(data.town_or_city);


      handleChange("address_line_1")({ target: { value: fullAddress } });
      handleChange("post_code")({ target: { value: data.postcode } });
      handleChange("place")({ target: { value: data.town_or_city } });

     setTouched((prev) => ({ ...prev, address_line_1: true, place: true }));


      setSuggestions([]);
    } catch (err) {
      console.error("Failed to fetch address details", err);
    }
  };


  return (

  <div className="card-body">
   <form onSubmit={handleSubmit}>
    {/* Row 1: Name, Email, Postcode */}
    <div className="row">
      <div className="mb-3 col-md-4 col-sm-12">
        <label className="form-label">
          Name <i className="text-danger">*</i>
        </label>
        <input
          type="text"
          className={getClass("candidate_name", values.candidate_name || "")}
          value={values.candidate_name || ""}
          onChange={handleChange("candidate_name")}
          onBlur={() => setTouched({ ...touched, candidate_name: true })}
          placeholder="Enter your name"
          required
        />
      </div>

     

      <div className="mb-3 col-md-2 col-sm-12 position-relative">
        <label htmlFor="post_code" className="form-label">
          Postcode <i className="text-danger">*</i>
        </label>
        <input
          type="text"
          className={getClass("post_code", values.post_code || "")}
          value={values.post_code || ""}
          onChange={(e) => {
            handleChange("post_code")(e); 
            fetchAddresses(e.target.value);
          }}
          onBlur={() => setTouched({ ...touched, post_code: true })}
          placeholder="Post code"
          required
        />

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul
            className="list-group position-absolute w-100 shadow"
            style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
          >
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="list-group-item list-group-item-action"
                onClick={() => selectAddress(s.id)}
                style={{ cursor: "pointer" }}
              >
                {s.address}
              </li>
            ))}
          </ul>
        )}

        {loading && <div className="form-text text-muted">Searching...</div>}
      </div>

      <div className="mb-3 col-md-6 col-sm-12">
        <label className="form-label">
          Address <i className="text-danger">*</i>
        </label>
       <input
      type="text"
      className={getClass("address_line_1", values.address_line_1 || "")}
      value={values.address_line_1 || ""}
      onChange={handleChange("address_line_1")}
      onBlur={() => setTouched({ ...touched, address_line_1: true })}
      placeholder="Full address"
      required
    />
      </div>
    </div>

    {/* Row 2: Address & Place */}
    <div className="row">
      
      <div className="mb-3 col-md-6 col-sm-12">
        <label className="form-label">Place <i className="text-danger">*</i></label>
        <input
        type="text"
        className={getClass("place", values.place || "")}
        value={values.place || ""}
        onChange={handleChange("place")}
        onBlur={() => setTouched({ ...touched, place: true })}
        placeholder="Place"
        required
      />
      </div>

       <div className="mb-3 col-md-6 col-sm-12">
        <label className="form-label">
          Email <i className="text-danger">*</i>
        </label>
        <input
          type="email"
          className={getClass("email_id", values.email_id || "")}
          value={values.email_id || ""}
          onChange={handleChange("email_id")}
          onBlur={() => setTouched({ ...touched, email_id: true })}
          placeholder="Enter your email"
          required
        />
      </div>
    </div>

    {/* Row 3: Country Code & Mobile */}
    <div className="row">
      <div className="mb-3 col-md-6 col-sm-12">
        <label className="form-label">
          Country Code <i className="text-danger">*</i>{" "}
          <i
            className="fas fa-info-circle"
            title="Please provide the country code for your mobile"
          ></i>
        </label>
       <select
        className={getClass("countryCode", values.countryCode || "")}
        value={values.countryCode || ""}
        onChange={(e) => handleChange("countryCode")(e)}
       onBlur={() => setTouched(prev => ({ ...prev, countryCode: true }))}
        required
      >
          <option value="" disabled hidden>-Select-</option>
          {countryCodes.map((c, idx) => (
            <option key={idx} value={c.phonecode}>
              {c.name.charAt(0).toUpperCase() + c.name.slice(1).toLowerCase()} (+{c.phonecode})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 col-md-6 col-sm-12">
        <label className="form-label">
          Mobile <i className="text-danger">*</i>
        </label>
        <input
          type="tel"
          className={getClass("mobile_number", values.mobile_number || "")}
          value={values.mobile_number || ""}
          onChange={handleChange("mobile_number")}
          onBlur={() => setTouched({ ...touched, mobile_number: true })}
          pattern="[0-9]{10,15}"
          placeholder="Enter Mobile Number"
          required
          title="Please enter a valid mobile number (10 to 15 digits)."
        />
      </div>
    </div>

    {/* Row 4: DOB & Passport */}
    <div className="row">
      <div className="mb-3 col-md-6 col-sm-12">
        <label className="form-label">
          DOB <i className="text-danger">*</i>
        </label>
        <input
          type="date"
          className={getClass("candidate_dob", values.candidate_dob || "")}
          value={values.candidate_dob || ""}
          onChange={handleChange("candidate_dob")}
          onBlur={() => setTouched({ ...touched, candidate_dob: true })}
          required
          min={formatDate(minDate)}
          max={formatDate(maxDate)}
        />
      </div>

      <div className="mb-3 col-md-3 col-sm-12">
        <label htmlFor="passport" className="form-label">
          Passport <i className="text-danger">*</i>
        </label>
        <select
          className={getClass("passport", values.passport || "")}
          value={values.passport || ""}
          onChange={handlePassportChange} 
          onBlur={() => setTouched({ ...touched, passport: true })}
          required
        >
          <option value="">-Select-</option>
          <option value="UK">UK</option>
          <option value="EU">EU</option>
          <option value="EU-PRE">EU Pre Settled/Settled Status</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {hasOtherPassport && (
        <>
          <div className="mb-3 col-md-3 col-sm-12">
            <label htmlFor="passportCountry" className="form-label">
              Country of Passport
            </label>
            <select
          className={getClass("other_passport", values.other_passport || "")}
          value={values.other_passport || ""}
          onChange={(e) => {
          handleChange("other_passport")(e);
          setTouched((prev) => ({ ...prev, other_passport: true }));
        }}
          required
        >
          <option value="" disabled hidden>-Select-</option>
          {countryCodes.map((c, idx) => (
            <option key={idx} value={c.name.charAt(0).toUpperCase() + c.name.slice(1).toLowerCase()}>
             {c.name.charAt(0).toUpperCase() + c.name.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
          </div>


          <div className="mb-3">
            <label  className="form-label d-block">
              Do you have a current Visa to work in the UK ? 
            </label>
            <div className="form-check form-check-inline mt-2">
              <input
                id="visafor"
                className="form-check-input"
                type="radio"
                name="is_visa_for_uk"
                value="Yes"
                checked={values.is_visa_for_uk === "Yes"}
                onChange={handleChange("is_visa_for_uk")}
              />
              <label className="form-check-label" htmlFor='visafor'>Yes</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                id= 'visaNo'
                className="form-check-input"
                type="radio"
                name="is_visa_for_uk"
                value="No"
                checked={values.is_visa_for_uk === "No"}
                onChange={handleChange("is_visa_for_uk")}
              />
              <label className="form-check-label" htmlFor="visaNo">No</label>
            </div>
             {values.is_visa_for_uk === "No" && (
          <p className="text-danger mt-2">
            ⚠ Unfortunatrly, we can only accept candidates who have legal right to work in the UK.
          </p>
        )}
          </div>
        </>
      )}
      </div>

    {/* Submit Button */}
    <div className="d-flex justify-content-end">
     <button 
      type="submit" 
      className="btn btn-primary"
      disabled={
        !Object.keys(validators).every((field) =>
          isValid(field, values[field] || "")
        )
      }
    >
      Next
    </button>
    </div>
  </form>
</div>

  );
}
