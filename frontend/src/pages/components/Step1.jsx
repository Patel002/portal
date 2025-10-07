import { useEffect, useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Step1({ nextStep, handleChange, values }) {

    const Api_base_Url = import.meta.env.VITE_API_BASE;

    const [parent, setParent] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});
    const [logoPreview, setLogoPreview] = useState(null);
    const [subscriptionType, setSubscriptionType] = useState(values.subscription || "");

    const validators = {
    client_organisation: (val) => val.trim().length >= 2,
    post_code: (val) => val.trim().length >= 4,
    postal_address: (val) => val.trim().length >= 2,
    address_list: (val) => val.trim().length > 5,
    vat_number: (val) => /^[A-Za-z0-9\s-]+$/.test(val), 
    company_reg_number: (val) => /^[A-Za-z0-9\s-]+$/.test(val), 
    website: (val) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(val),
    subscription: (val) => !!val,
    monthly_cost: (val) => /^[0-9]+(\.[0-9]{1,2})?$/.test(val),
    monthly_payroll: (val) => subscriptionType.includes("Payroll") ? /^[0-9]+(\.[0-9]{1,2})?$/.test(val) : true,
    payroll_timesheet: (val) => subscriptionType.includes("Payroll") ? /^[0-9]+(\.[0-9]{1,2})?$/.test(val) : true,
    contact_name: (val) => val.trim().length >= 2,
    contact_position: (val) => val.trim().length >= 2,
    contact_email: (val) => /^\S+@\S+\.\S+$/.test(val),
    contact_mobile: (val) => /^[0-9]{10,15}$/.test(val.replace(/\D/g, "")),
    contact_number: (val) => /^[0-9]{10,15}$/.test(val.replace(/\D/g, "")),
  };

    const isPayrollRequired = !["Basic Subscription", "Premium Subscription", "Premium Plus Subscription"].includes(subscriptionType);

    useEffect(() => {
        const fetchParent = async () => {
         try {
             const res = await axios.get(`${Api_base_Url}/client/get_parent_entity`)
            setParent(res.data.data || []);
            
        } catch (error) {
            console.log("step 1", error);
        }   
        }
        fetchParent();
    }, []);


  const handleSubmit = (e) => {
  e.preventDefault();
   const isValid = Object.keys(validators).every(key => validators[key](values[key]));
    if (isValid) nextStep();
    else alert("Please correct the errors in the form");
};

 const getClass = (field) => {
  if (!values[field]) return "form-control form-control-sm";

  if (validators[field]) {
    return validators[field](values[field])
      ? "form-control form-control-sm border border-success"
      : "form-control form-control-sm border border-danger";
  }

  return "form-control form-control-sm";
};



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


      handleChange("address_list")({ target: { value: fullAddress } });
      handleChange("post_code")({ target: { value: data.postcode } });
      handleChange("postal_address")({ target: { value: data.town_or_city } });

     setTouched((prev) => ({ ...prev, address_list: true, postal_address: true }));


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
   <form onSubmit={handleSubmit}>
    <div className="row">
      <div className="mb-1 col-md-3 col-sm-12">
        <label className="form-label">
          Client Organisation <i className="text-danger">*</i>
        </label>
        <input
          type="text"
          className={`form-control form-control-sm ${getClass("client_organisation", values.client_organisation || "")}`}
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
              className={`form-control form-control-sm ${getClass("parent_entity", values.parent_entity || "")}`}
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
          className={`form-control form-control-sm ${getClass("post_code", values.post_code || "")}`}
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
        className={`form-control form-control-sm  ${getClass("postal_address", values.postal_address || "")}`}
        value={values.postal_address || ""}
        onChange={handleChange("postal_address")}
        onBlur={() => setTouched({ ...prev,...touched, postal_address: true })}
        placeholder="postal_address"
        required
      />
      </div>

      <div className="mb-2 col-md-3 col-sm-7">
        <label className="form-label">
          Registered Address <i className="text-danger">*</i>
        </label>
       <input
      type="text"
      className={`form-control form-control-sm  ${getClass("address_list", values.address_list || "")}`}
      value={values.address_list || ""}
      onChange={handleChange("address_list")}
      onBlur={() => setTouched({ ...touched, address_list: true })}
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
                className={`form-control form-control-sm  ${getClass("vat_number", values.vat_number || "")}`}
                value={values.vat_number || ""}
                onChange={handleChange("vat_number")}
                onBlur={() => setTouched({ ...touched, vat_number: true })}
                placeholder="Enter VAT Number"
                />
            </div>

            {/* Company Registration Number */}
            <div className="mb-2 col-md-3 col-sm-6">
                <label className="form-label small">Company Registration Number</label>
                <input
                type="text"
                className= {`form-control form-control-sm  ${getClass("company_reg_number", values.company_reg_number || "")}`}
                value={values.company_reg_number || ""}
                onChange={handleChange("company_reg_number")}
                onBlur={() => setTouched({ ...touched, company_reg_number: true })}
                placeholder="Enter Registration Number"
                />
            </div>

            {/* Website */}
            <div className="mb-2 col-md-3 col-sm-6">
                <label className="form-label small">Website</label>
                <input
                type="url"
                className={`form-control form-control-sm  ${getClass("website", values.website || "")}`}
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
                    className={`form-control form-control-sm  ${getClass("client_logo", values.client_logo || "")}`}
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
                  className={`form-control form-control-sm  ${getClass("monthly_cost", values.monthly_cost || "")}`}
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
                  className={`form-control form-control-sm  ${getClass("monthly_payroll", values.monthly_payroll || "")}`}
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
                  className={`form-control form-control-sm  ${getClass("payroll_timesheet", values.payroll_timesheet || "")}`}
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
      className={`form-control form-control-sm ${getClass("contact_name", values.contact_name || "")}`}
      value={values.contact_name || ""}
      onChange={handleChange("contact_name")}
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
      className={`form-control form-control-sm ${getClass("contact_position", values.contact_position || "")}`}
      value={values.contact_position || ""}
      onChange={handleChange("contact_position")}
      placeholder="Enter Official Position or Designation"
      required
    />
  </div>

<div className="mb-3 col-md-4 col-sm-12">
  <label className="form-label d-block">
    Landline Number <i className="text-danger">*</i>
  </label>
   <PhoneInput
              country={"gb"}
              value={values.contact_number || ""}
              onChange={(phone, countryData) =>{ 
                handleChange("contact_number")({ target: { value: phone } })
                handleChange("lane_code")({ target: { value: countryData.dialCode }})
              }}
              inputProps={{
                name: "contact_number",
                required: true,
                className: getClass("contact_number", values.contact_number || ""),
              }}
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
          className={`form-control form-control-sm ${getClass("contact_email", values.contact_email || "")}`}
          value={values.contact_email || ""}
          onChange={handleChange("contact_email")}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-3 col-md-4 col-sm-8">
  <label className="form-label d-block">
    Mobile <i className="text-danger">*</i>
  </label>
      <PhoneInput
          country={"gb"}
          value={values.contact_mobile || ""}
          onChange={(phone, countryData) => {
            handleChange("contact_mobile")({ target: { value: phone }})
            handleChange("mobile_code")({ target: { value: countryData.dialCode }})
        }}
          inputProps={{
            name: "contact_mobile",
            required: true,
            className: getClass("contact_mobile", values.contact_mobile || ""),
          }}
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