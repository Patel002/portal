import { useEffect, useState, useRef } from "react";
import axios from "axios";
import intlTelInput  from 'intl-tel-input'
import 'intl-tel-input/build/css/intlTelInput.css';

export default function Step1({ nextStep, handleChange, values }) {

    const [parent, setParent] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [logoPreview, setLogoPreview] = useState(null);
    const [subscriptionType, setSubscriptionType] = useState(values.subscription || "");
    const phoneInputRef = useRef(null);
    const landlineInputRef = useRef(null);

      const validators = {
    client_organisation: (val) => val.trim().length >= 2,
    post_code: (val) => val.trim().length >= 4,
    place: (val) => val.trim().length >= 2,
    address_line_1: (val) => val.trim().length > 5,
    vat_number: (val) => true, // optional
    company_reg_number: (val) => true, // optional
    website: (val) => !val || /^https?:\/\/[^\s$.?#].[^\s]*$/.test(val),
    subscription: (val) => !!val,
    monthly_cost: (val) => /^[0-9]+(\.[0-9]{1,2})?$/.test(val),
    monthly_payroll: (val) => subscriptionType.includes("Payroll") ? /^[0-9]+(\.[0-9]{1,2})?$/.test(val) : true,
    payroll_timesheet: (val) => subscriptionType.includes("Payroll") ? /^[0-9]+(\.[0-9]{1,2})?$/.test(val) : true,
    candidate_name: (val) => val.trim().length >= 2,
    position: (val) => val.trim().length >= 2,
    email_id: (val) => /^\S+@\S+\.\S+$/.test(val),
    contact_number: (val) => /^[0-9]{10,15}$/.test(val.replace(/\D/g, "")),
    lan_code: (val) => /^[0-9]{10,15}$/.test(val.replace(/\D/g, "")),
  };



    const isPayrollRequired = !["Basic Subscription", "Premium Subscription", "Premium Plus Subscription"].includes(subscriptionType);

    useEffect(() => {
        const fetchParent = async () => {
         try {
             const res = await axios.get("http://localhost:7171/api/client/get_parent_entity")
            setParent(res.data.data || []);
            
        } catch (error) {
            console.log("step 1", error);
        }   
        }
        fetchParent();
    }, []);

  const validateForm = () => {
    let newErrors = {};
    for (let field in validators) {
      if (!validators[field](values[field] || "")) {
        newErrors[field] = true;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep();
    }
  };

const getClass = (field, value) => {
    if (errors[field]) return "form-control is-invalid";
    if (values[field] && validators[field](value)) return "form-control is-valid";
    return "form-control";
  };


useEffect(() => {
  let itiMobile, itiLandline;
  let updateMobile, updateLandline;

  if (phoneInputRef.current) {
    itiMobile = intlTelInput(phoneInputRef.current, {
      initialCountry: "gb",
      separateDialCode: true,
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
    });

    updateMobile = () => {
      handleChange("contact_mobile")({ target: { value: itiMobile.getNumber() } });
    };

    phoneInputRef.current.addEventListener("countrychange", updateMobile);
    phoneInputRef.current.addEventListener("input", updateMobile);
  }

  if (landlineInputRef.current) {
    itiLandline = intlTelInput(landlineInputRef.current, {
      initialCountry: "gb",
      separateDialCode: true,
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
    });

    updateLandline = () => {
      handleChange("lane_code")({ target: { value: itiLandline.getNumber() } });
    };

    landlineInputRef.current.addEventListener("countrychange", updateLandline);
    landlineInputRef.current.addEventListener("input", updateLandline);
  }

  return () => {
    if (phoneInputRef.current && updateMobile) {
      phoneInputRef.current.removeEventListener("countrychange", updateMobile);
      phoneInputRef.current.removeEventListener("input", updateMobile);
    }
    if (landlineInputRef.current && updateLandline) {
      landlineInputRef.current.removeEventListener("countrychange", updateLandline);
      landlineInputRef.current.removeEventListener("input", updateLandline);
    }
  };
}, [handleChange]);



     const fetchAddresses = async (value) => {
    // setPostcode(value);
    // handleChange("post_code")({ target: { value } });

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }


    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:7171/api/address/${value}`);
      
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
      const res = await axios.get(`http://localhost:7171/api/address/get/${id}`);
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("client_logo")({ target: { value: file } });
      setLogoPreview(URL.createObjectURL(file));
    }
  };


  
return (
  <div className="card-body">
   <form>
    <div className="row">
      <div className="mb-1 col-md-3 col-sm-12">
        <label className="form-label">
          Client Organisation <i className="text-danger">*</i>
        </label>
        <input
          type="text"
          className={"form-control"}
          value={values.client_organisation || ""}
          onChange={handleChange("client_organisation")}
          placeholder="Enter Client Organisation"
          required
        />
      </div>
     <div className="mb-2 col-md-2 col-sm-4">
            <label className="form-label">Parent Entity (if any)</label>
            <select
              name="parent_entity"
              className="form-control"
              value={values.parent_entity || ""}
              onChange={handleChange("parent_entity")}
            >
              <option value="">Select</option>
              {parent.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.client_organisation}
                </option>
              ))}
            </select>
          </div>

           <div className="mb-3 col-md-2 col-sm-4 position-relative">
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
        //   onBlur={() => setTouched({ ...touched, post_code: true })}
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
                key={s.id}
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

      <div className="mb-3 col-md-2 col-sm-4">
        <label className="form-label">Place <i className="text-danger">*</i></label>
        <input
        type="text"
        className={getClass("place", values.place || "")}
        value={values.place || ""}
        onChange={handleChange("place")}
        // onBlur={() => setTouched({ ...touched, place: true })}
        placeholder="Place"
        required
      />
      </div>

      <div className="mb-2 col-md-3 col-sm-7">
        <label className="form-label">
          Registered Address <i className="text-danger">*</i>
        </label>
       <input
      type="text"
      className={getClass("address_line_1", values.address_line_1 || "")}
      value={values.address_line_1 || ""}
      onChange={handleChange("address_line_1")}
    //   onBlur={() => setTouched({ ...touched, address_line_1: true })}
      placeholder="Full address"
      required
    />
      </div>

          <div className="row mt-3">
  {/* VAT Number */}
            <div className="mb-2 col-md-3 col-sm-6">
                <label className="form-label small">VAT Number</label>
                <input
                type="text"
                className="form-control form-control-sm"
                value={values.vat_number || ""}
                onChange={handleChange("vat_number")}
                placeholder="Enter VAT Number"
                />
            </div>

            {/* Company Registration Number */}
            <div className="mb-2 col-md-3 col-sm-6">
                <label className="form-label small">Company Registration Number</label>
                <input
                type="text"
                className="form-control form-control-sm"
                value={values.company_reg_number || ""}
                onChange={handleChange("company_reg_number")}
                placeholder="Enter Registration Number"
                />
            </div>

            {/* Website */}
            <div className="mb-2 col-md-3 col-sm-6">
                <label className="form-label small">Website</label>
                <input
                type="url"
                className="form-control form-control-sm"
                value={values.website || ""}
                onChange={handleChange("website")}
                placeholder="https://example.com"
                />
            </div>

            {/* Client Logo + Preview */}
            <div className="mb-2 col-md-3 col-sm-6">
                <label className="form-label small">Client Logo</label>
                <div className="d-flex align-items-center">
                {/* File input takes full width minus preview space */}
                <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="image/*"
                    onChange={handleLogoChange}
                    style={{ flex: 1, minWidth: 0 }} 
                />

                {/* Fixed size preview so input never shifts down */}
                {logoPreview && (
                    <div
                    className="ms-2 border rounded d-flex align-items-cent mb-2"
                    style={{
                        width: "50px",
                        height: "50px",
                        flexShrink: 0,
                        overflow: "hidden",
                        background: "#f8f9fa"
                    }}
                    >
                    <img
                        src={logoPreview}
                        alt="Logo Preview"
                        style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                        }}
                    />
                    </div>
                )}
                </div>
            </div>
            </div>
            
            <hr className="my-2 mx-n1 border-0 border-top border-secondary" style={{ opacity: 0.25, color:"#BFBFFF" }} />


             <div className="row mt-3">
          <div className="form-group col-md-3 col-sm-6">
            <label className="form-label small">Subscription Type <i className="text-danger">*</i></label>
            <select
              className="form-control form-control-sm"
              value={subscriptionType}
              onChange={(e) => {
                setSubscriptionType(e.target.value);
                handleChange("subscription")({ target: { value: e.target.value } });
              }}
              required
            >
              <option value="">Select one from List</option>
              <option value="Basic Subscription">Basic Subscription</option>
              <option value="Premium Subscription">Premium Subscription</option>
              <option value="Premium Subscription with Payroll">Premium Subscription with Payroll</option>
              <option value="Premium Plus Subscription">Premium Plus Subscription</option>
              <option value="Premium Plus Subscription with Payroll">Premium Plus Subscription with Payroll</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        

           <div className="form-group col-md-3 col-sm-6">
                <label className="form-label small">Monthly Subscription Cost <i className="text-danger">*</i></label>
                <input
                  type="text"
                  step="0.01"
                  className="form-control form-control-sm"
                  placeholder="Enter Monthly Cost (e.g. 99.99)"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..{2})./g, '$1'))
                  }
                  value={values.monthly_cost || ""}
                  onChange={handleChange("monthly_cost")}
                  required
                />
              </div>
        {/* Conditional row: either payroll costs or employment contract */}
          {isPayrollRequired ? (
            <>
              {/* Monthly Payroll Fields */}
              <div className="form-group col-md-3 col-sm-6 payrolldiv">
                <label className="form-label small">Monthly Payroll Subscription Cost <i className="text-danger">*</i></label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Enter Monthly Payroll Subscription Cost"
                  value={values.monthly_payroll || ""}
                  onChange={handleChange("monthly_payroll")}
                  required
                />
              </div>

              <div className="form-group col-md-3 col-sm-6 payrolldiv">
                <label className="form-label small">Payroll Cost Per Timesheet <i className="text-danger">*</i></label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Payroll Cost Per Timesheet"
                  value={values.payroll_timesheet || ""}
                  onChange={handleChange("payroll_timesheet")}
                  required
                />
              </div>
            </>
          ) : (
            <>
              {/* Employment contract if no payroll */}
              <div className="form-group col-md-3 col-sm-6 nopayrolldiv">
                <label className="form-label small">Employment Contract Supplied <i className="text-danger">*</i></label>
                <div>
                  <input
                    type="radio"
                    name="no_payroll"
                    value="YES"
                    id="no_payroll_yes"
                    onChange={handleChange("no_payroll")}
                    required
                  />{" "}
                  <label htmlFor="no_payroll_yes">YES</label>
                  <input
                    type="radio"
                    name="no_payroll"
                    value="NO"
                    id="no_payroll_no"
                    onChange={handleChange("no_payroll")}
                    required
                    className="ms-2"
                  />{" "}
                  <label htmlFor="no_payroll_no">NO</label>
                </div>
              </div>

              <div className="col-md-3 col-sm-6 nopayrolldiv">
                <label className="form-label small" htmlFor="upload">Upload Employment Contract</label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  id="upload"
                  name="upload"
                  onChange={handleChange("upload")}
                />
              </div>
            </>
          )}
        </div>

         <hr className="my-2 mx-n1 border-0 border-top border-secondary" style={{ opacity: 0.25,backgroundColor:"#BFBFFF" }} />

       <div className="row mt-3">
  <h6 style={{ color: "#BFBFFF", textDecoration: "underline"}}>Main Contact Details</h6>

  <div className="mb-3 col-md-4 col-sm-12">
    <label className="form-label">
      Full Name <i className="text-danger">*</i>
    </label>
    <input
      type="text"
      className={`form-control form-control-sm ${getClass("candidate_name", values.candidate_name || "")}`}
      value={values.candidate_name || ""}
      onChange={handleChange("candidate_name")}
      onBlur={() => setTouched({ ...touched, candidate_name: true })}
      placeholder="Enter your name"
      required
    />
  </div>

  <div className="mb-3 col-md-4 col-sm-12">
    <label className="form-label">
      Position <i className="text-danger">*</i>
    </label>
    <input
      type="text"
      className={`form-control form-control-sm ${getClass("position", values.position || "")}`}
      value={values.position || ""}
      onChange={handleChange("position")}
      onBlur={() => setTouched({ ...touched, position: true })}
      placeholder="Enter Official Position or Designation"
      required
    />
  </div>

  <div className="mb-3 col-md-4 col-sm-12">
    <label className="form-label d-block">
      Landline Number <i className="text-danger">*</i>
    </label>
    <input
      type="tel"
      className={`form-control form-control-sm ${getClass("lan_code", values.lan_code || "")}`}
      ref={landlineInputRef}
      value={values.lan_code || ""}
      onChange={handleChange("lan_code")}
      onBlur={() => setTouched({ ...touched, lan_code: true })}
      pattern="[0-9]{10,15}"
      placeholder="Enter Landline Number"
      required
      title="Please enter a valid mobile number (10 to 15 digits)."
    />
  </div>
</div>

<div className="row">
       <div className="mb-3 col-md-4 col-sm-8">
        <label className="form-label">
          Email <i className="text-danger">*</i>
        </label>
        <input
          type="email"
          className={`form-control form-control-sm ${getClass("email_id", values.email_id || "")}`}
          value={values.email_id || ""}
          onChange={handleChange("email_id")}
          onBlur={() => setTouched({ ...touched, email_id: true })}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-3 col-md-4 col-sm-8">
    <label className="form-label d-block">
      Mobile <i className="text-danger">*</i>
    </label>
    <input
      type="tel"
      className={`form-control form-control-sm ${getClass("contact_number", values.mobile_number || "")}`}
      ref={phoneInputRef}
      value={values.contact_number || ""}
      onChange={handleChange("contact_number")}
      onBlur={() => setTouched({ ...touched, contact_number: true })}
      pattern="[0-9]{10,15}"
      placeholder="Enter Mobile Number"
      required
      title="Please enter a valid mobile number (10 to 15 digits)."
    />
  </div>
    </div>


      </div>
       <div className="d-flex justify-content-end">
      <button type="submit" className="btn btn-primary">
        Next
      </button>
      </div>
      </form>
      </div>
      );
      
}