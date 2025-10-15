import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useCandidateOptions from "../../hooks/useCandidateOptions";
import axios from 'axios';
import showToast from '../../helper/toast.js';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; 
import Select from "react-select";
import '../../css/edit.css'

const Edituser = () => {

    const Api_base_Url = import.meta.env.VITE_API_BASE;

    const { id } = useParams();

    const decodedId = atob(id);

    const[loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [parent, setParent] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [serviceSuggestions, setServiceSuggestions] = useState({}); 
    const [logoPreview, setLogoPreview] = useState(null);

    const {
    careFacilityQuery,
    clientNeedsQuery,
    jobTitleQuery,
    } = useCandidateOptions();

    const options = {
      care_facility: careFacilityQuery.data || [],
      client_need: clientNeedsQuery.data || [],
      job_title: jobTitleQuery.data || [],
    }
    

    const [profileData, setProfileData] = useState({ 
        client_organisation: "",
        post_code: "",
        place: "",
        register_address: "",
        vat_number: "",
        company_reg: "",
        website: "",
        parent_entity: "",
        main_email: "",
        mobile_number: "",
        subscription_type: "",
        payroll_timesheet: "",
        mobile_code: "",
        upload: "",
        lan_number: "",
        lan_code: "",  
        main_position: "",
        main_fullName: "",
        client_logo: "",
        no_payroll: "",
        finance_name: "",
        finance_no: "",
        finance_position: "",
        finance_mobile_code: "",
        finance_mobile: "",
        finance_entity_address: "",
        finance_email: "",
        finance_cradit_limit: "",   
        billing_name: "",
        billing_position: "",
        billing_number: "",
        billing_mobile_code: "",
        billing_mobile: "",
        billing_email: "",
        billing_entity_address: ""
     });

     const subscriptionType = profileData.subscription_type;

     const [serviceData, setServiceData] = useState([]);

    // const [shiftData, setShiftData] = useState({ shiftStart: "", shiftEnd: "", workingDays: [] });
    
    // const [payrateData, setPayrateData] = useState({ hourlyRate: "", monthlySalary: "" });

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

    const fetchAddresses = async (value) => {

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${Api_base_Url}/address/${value}`);
      setSuggestions(res.data.suggestions || []);

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

      handleChange("profile","register_address")({ target: { value: fullAddress } });
      handleChange("profile","post_code")({ target: { value: data.postcode } });
      handleChange("profile","place")({ target: { value: data.town_or_city } });

      setSuggestions([]);
    } catch (err) {
      console.error("Failed to fetch address details", err);
    }
  };

  const fetchServiceAddresses = async (value, index) => {
  if (value.length < 2) {
    setServiceSuggestions(prev => ({ ...prev, [index]: [] }));
    return;
  }

  try {
    setLoading(true);
    const res = await axios.get(`${Api_base_Url}/address/${value}`);

    console.log(res.data.suggestions);
    console.log('response for adress',res);
    setServiceSuggestions(prev => ({ ...prev, [index]: res.data.suggestions || [] }));
  } catch (err) {
    console.error("Address lookup failed", err);
  } finally {
    setLoading(false);
  }
};

const selectAddressForServices = async (id, index) => {
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

    console.log("fullAddress", fullAddress);

    handleServiceChange(index, "address", fullAddress);
    handleServiceChange(index, "post_code", data.postcode);
    handleServiceChange(index, "place", data.town_or_city);

    setServiceSuggestions(prev => ({ ...prev, [index]: [] }));
  } catch (err) {
    console.error("Failed to fetch address details", err);
  }
};



   useEffect(() => {
       const fetchProfileData = async () => {
       try {
         const response = await axios.get(`http://localhost:7171/api/client/info?id=${decodedId}`);
         const userData = response.data.data?.[0] || {};

        setProfileData(userData);
        // console.log("Fetched profile data:", response.data);
         setLoading(false);
       } catch (error) {
         console.error("Error fetching profile data:", error);
         showToast("error", "Failed to fetch user data.");
       }
     };

     const fetchServiceData = async () => {
         try {
            const res = await axios.get(`http://localhost:7171/api/client/get-all-services?client_id=${decodedId}`);
            setServiceData(res.data.data || []);
            // console.log("Fetched service data:", res.data);

        } catch (error) {
            console.error("Error fetching service data:", error);
            showToast("error", "Failed to fetch service info.");
        }
    };

     fetchProfileData();
     fetchServiceData();

   }, [id]);

    const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prev) => ({ ...prev, client_logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

   const handleSubmit = async (section) => {
  setLoading(true);

  try {
    let url = "";
    let payload = {};

    switch (section) {
      case "profile":
      case "finance":
        url = `http://localhost:7171/api/client/update-client-details?client_id=${decodedId}`;
        payload = profileData;
        break;

      case "service":
        url = `http://localhost:7171/api/client/update-client-service?client_id=${decodedId}`;
        payload = {
      client_id: decodedId,
      service_entries: serviceData.map(service => ({
      id: service.id,
      post_code: service.post_code || "",
      place: service.place || "",
      address: service.address || "",
      type: service.address_type || "",
      entity_name: service.entity_name || "",
      care_facility: service.care_type || "",
      client_need: service.client_need || [], 
      facility_contact_name: service.facility_contact_name || "",
      facility_lane_code: service.landline_code || "",
      facility_contact_landline_no: service.landline_no || "",
      facility_mobile_code: service.mobile_code || "",
      facility_contact_mobile_no: service.mobile_no || "",
      facility_contact_email: service.email || ""
    }))
  };;
  console.log("payload", payload);
        break;


      case "payrate":
        url = `http://localhost:7171/api/client/update-payrate/${decodedId}`;
        payload = payrateData;
        break;

      default:
        showToast("error", "Invalid section selected!");
        setLoading(false);
        return;
    }

    const response = await axios.patch(url, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      showToast(
        "success",
        `${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`
      );
    } else {
      showToast("error", `Failed to update ${section}.`);
    }
  } catch (error) {
    console.error(`Error updating ${section}:`, error);
    showToast("error", `Failed to update ${section}.`);
  } finally {
    setLoading(false);
  }
};

const handleServiceChange = (index, field, value) => {
  setServiceData((prev) =>
    prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
  );
};

const handleChange = (section, field) => (e) => {
  const value = e?.target ? e.target.value : e;

  switch (section) {
    case "profile":
      setProfileData((prev) => ({ ...prev, [field]: value }));
      break;

    case "finance":
      setProfileData((prev) => ({ ...prev, [field]: value }));
      break;

    case "shift":
      setShiftData((prev) => ({ ...prev, [field]: value }));
      break;

    case "payrate":
      setPayrateData((prev) => ({ ...prev, [field]: value }));
      break;

    default:
      console.warn(`Unknown section: ${section}`);
      break;
  }
};

const getClass = (field, value) => {
    if (value === "" || value === null || value === undefined) return "is-invalid";
    return "is-valid";
  };


  return (
    <div className="content-wrapper">
      <section className="content mt-5">
        <div className="card card-outline">
            <div className="card-header p-2 custom-card-header" >
                <ul className="nav nav-pills justify-content-start">
                    {["profile", "service", "finance", "payrate"].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab ? "active text-white" : "text-white"}`}
                    onClick={() => setActiveTab(tab)}
                    style={{
                        borderRadius: "10px",
                        marginRight: "10px",
                        transition: "0.3s",
                        backgroundColor: activeTab === tab ? "#0000FF" : "#141e3dff", // inactive tab color
                        border: "none",
                        padding: "6px 18px",
                    }}
                    >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                </li>
                ))}
            </ul>
            </div>


        <div className="card-body">
            {activeTab === "profile" && (
        <div>
    <div className="container-fluid">
        <div className="row">
            <div className="mb-3 col-md-3 col-sm-12">
            <label className="form-label">
                Client Organisation <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("client_organisation", profileData.client_organisation || "")}`}
                value={profileData.client_organisation || ""}
                onChange={handleChange("profile","client_organisation")}
                placeholder="Enter Client Organisation"
                required
            />
            </div>

            <div className="mb-3 col-md-3 col-sm-6">
            <label className="form-label">Parent Entity (if any)</label>
            <select
                className="form-control form-control-sm"
                value={profileData.parent_entity || ""}
                onChange={handleChange("profile","parent_entity")}
            >
                <option value="">Select</option>
                {parent.map((item) => (
                <option key={item.id} value={item.id}>
                    {item.client_organisation}
                </option>
                ))}
            </select>
            </div>

            <div className="mb-3 col-md-2 col-sm-6 position-relative">
            <label className="form-label">
                Postcode <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("post_code", profileData.post_code || "")}`}
                value={profileData.post_code || ""}
                onChange={(e) => {
                handleChange("profile","post_code")(e);
                fetchAddresses(e.target.value);
                }}
                placeholder="Post code"
                required
            />
            {suggestions.length > 0 && (
                <ul className="list-group position-absolute w-100 shadow"
                    style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}>
                {suggestions.map((s) => (
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

            <div className="mb-3 col-md-2 col-sm-6">
            <label className="form-label">Place <i className="text-danger">*</i></label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("postal_address", profileData.place || "")}`}
                value={profileData.place || ""}
                onChange={handleChange("profile","place")}
                placeholder="Place"
                required
            />
            </div>

            <div className="mb-3 col-md-2 col-sm-12">
            <label className="form-label">
                Registered Address <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("register_address", profileData.register_address || "")}`}
                value={profileData.register_address || ""}
                onChange={handleChange("profile","register_address")}
                placeholder="Full address"
                required
            />
            </div>
        </div>

        <div className="row">
            <div className="mb-3 col-md-3 col-sm-6">
            <label className="form-label">VAT Number <i className="text-danger">*</i></label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("vat_number", profileData.vat_number || "")}`}
                value={profileData.vat_number || ""}
                onChange={handleChange("profile","vat_number")}
                placeholder="Enter VAT Number"
                required
            />
            </div>

            <div className="mb-3 col-md-3 col-sm-6">
            <label className="form-label">Company Registration Number <i className="text-danger">*</i></label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("company_reg", profileData.company_reg || "")}`}
                value={profileData.company_reg || ""}
                onChange={handleChange("profile","company_reg")}
                placeholder="Enter Registration Number"
                required
            />
            </div>

            <div className="mb-3 col-md-3 col-sm-6">
            <label className="form-label">Website <i className="text-danger">*</i></label>
            <input
                type="url"
                className={`form-control form-control-sm ${getClass("website", profileData.website || "")}`}
                value={profileData.website || ""}
                onChange={handleChange("profile","website")}
                placeholder="https://example.com"
                required
            />
            </div>

            <div className="mb-3 col-md-3 col-sm-6">
            <label className="form-label">Client Logo</label>
            <div className="d-flex align-items-center">
                <input
                type="file"
                className="form-control form-control-sm"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ flex: 1, minWidth: 0 }}
                />
                {logoPreview && (
                <div
                    className="ms-2 border rounded d-flex align-items-center"
                    style={{ width: "50px", height: "50px", overflow: "hidden", background: "#f8f9fa" }}
                >
                    <img src={logoPreview} alt="Logo Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                )}
            </div>
            </div>
        </div>

        <hr className="section-line" />

        <div className="row">
            <div className="form-group col-md-3 col-sm-6">
            <label className="form-label">Subscription Type <i className="text-danger">*</i></label>
            <select
                className="form-control form-control-sm"
                value={profileData.subscription_type || ""}
                onChange={handleChange("profile", "subscription_type")}
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
            <label className="form-label">Monthly Subscription Cost <i className="text-danger">*</i></label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("monthly_cost", profileData.monthly_cost || "")}`}
                placeholder="Enter Monthly Cost"
                onInput={(e) =>
                (e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..{2})./g, '$1'))
                }
                value={profileData.monthly_cost || ""}
                onChange={handleChange("profile","monthly_cost")}
                required
            />
            </div>

            {isPayrollRequired ? (
            <>
                <div className="form-group col-md-3 col-sm-6">
                <label className="form-label">Monthly Payroll Subscription Cost <i className="text-danger">*</i></label>
                <input
                    type="text"
                    className={`form-control form-control-sm ${getClass("monthly_payroll", profileData.monthly_payroll || "")}`}
                    value={profileData.monthly_payroll || ""}
                    onChange={handleChange("profile","monthly_payroll")}
                    required
                />
                </div>

                <div className="form-group col-md-3 col-sm-6">
                <label className="form-label">Payroll Cost Per Timesheet <i className="text-danger">*</i></label>
                <input
                    type="text"
                    className={`form-control form-control-sm ${getClass("payroll_timesheet", profileData.payroll_timesheet || "")}`}
                    value={profileData.payroll_timesheet || ""}
                    onChange={handleChange("profile","payroll_timesheet")}
                    required
                />
                </div>
            </>
            ) : (
            <>
                <div className="form-group col-md-3 col-sm-6">
                <label className="form-label">Employment Contract Supplied <i className="text-danger">*</i></label>
                <div>
                    <input type="radio" name="no_payroll" value="YES"
                    checked={profileData.no_payroll === "YES"}
                    onChange={handleChange("profile","no_payroll")}
                    />{" "}
                    <label>YES</label>
                    <input type="radio" name="no_payroll" value="NO"
                    className="ms-2"
                    checked={profileData.no_payroll === "NO"}
                    onChange={handleChange("profile","no_payroll")}
                    />{" "}
                    <label>NO</label>
                </div>
                </div>

                <div className="col-md-3 col-sm-6">
                <label className="form-label">Upload Employment Contract</label>
                <input
                    type="file"
                    className="form-control form-control-sm"
                    onChange={handleChange("profile","upload")}
                />
                </div>
            </>
            )}
        </div>

        <hr className="section-line" />

        
        <h6 className="text-decoration-underline" style={{ color: "#EBA9E0" }}>Main Contact Details</h6>

        <div className="row">
            <div className="mb-3 col-md-4 col-sm-12">
            <label className="form-label">Full Name <i className="text-danger">*</i></label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("main_fullName", profileData.main_fullName || "")}`}
                value={profileData.main_fullName || ""}
                onChange={handleChange("profile","main_fullName")}
                placeholder="Enter full name"
                required
            />
            </div>

            <div className="mb-3 col-md-4 col-sm-12">
            <label className="form-label">Position <i className="text-danger">*</i></label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("main_position", profileData.main_position || "")}`}
                value={profileData.main_position || ""}
                onChange={handleChange("profile","main_position")}
                placeholder="Enter designation"
                required
            />
            </div>

            <div className="mb-3 col-md-4 col-sm-12">
            <label className="form-label d-flex">
            Landline Number <i className="text-danger ms-1">*</i>
            </label>
            <PhoneInput
            country={"gb"}
            value={profileData.lan_number || ""}
            onChange={(phone, countryData) => {
                handleChange("profile", "lan_number")({ target: { value: phone } });
                handleChange("profile", "lane_code")({ target: { value: countryData.dialCode } });
            }}
            containerClass="w-100"
            inputClass={`form-control form-control-sm w-100 ${getClass(
                "lan_number",
                profileData.lan_number || ""
            )}`}
            inputProps={{
                name: "lan_number",
                required: true,
            }}
            />
        </div>
    </div>

        <div className="row">
            <div className="mb-3 col-md-4 col-sm-12">
            <label className="form-label">Email <i className="text-danger">*</i></label>
            <input
                type="email"
                className={`form-control form-control-sm ${getClass("main_email", profileData.main_email || "")}`}
                value={profileData.main_email || ""}
                onChange={handleChange("profile","main_email")}
                placeholder="Enter email"
                required
            />
            </div>

        <div className="mb-3 col-md-4 col-sm-12">
            <label className="form-label d-block">
            Mobile <i className="text-danger">*</i>
            </label>
            <PhoneInput
            country={"gb"}
            value={profileData.mobile_number || ""}
            onChange={(phone, countryData) => {
                handleChange("profile", "mobile_number")({ target: { value: phone } });
                handleChange("profile", "mobile_code")({ target: { value: countryData.dialCode } });
            }}
            containerClass="w-100"
            inputClass={`form-control form-control-sm w-100 ${getClass(
                "mobile_number",
                profileData.mobile_number || ""
            )}`}
            inputProps={{
                name: "mobile_number",
                required: true,
            }}
            />
           </div>
        </div>
    </div>

        <div className="row mt-4 ml-1">
        <div className="col-12 ">
            <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() => handleSubmit("profile")}
            disabled={loading}
            >
            {loading ? "Saving..." : "Update Profile"}
            </button>
           </div>
        </div>
    </div>
            )}

           {activeTab === "service" && (
         <div>
    {serviceData.length === 0 ? (
      <p>No service data found for this client.</p>
    ) : (
      serviceData.map((service, index) => (
        <div key={service.id} className="card p-3 mb-3 shadow-sm">
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Address Type</label>
               <select name="type" 
              className={`form-control`}
              value={service.address_type || ""} 
              onChange={(e) => handleServiceChange(index, "address_type", e.target.value)} 
              required >
                <option value="">-Select-</option>
                <option value="Head Office">Head Office</option>
                <option value="Subsidiary">Subsidiary</option>
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Entity Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={service.entity_name || ""}
                onChange={(e) =>
                  handleServiceChange(index, "entity_name", e.target.value)
                }
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                value={service.email || ""}
                onChange={(e) =>
                  handleServiceChange(index, "email", e.target.value)
                }
              />
            </div>

            <div className="col-md-3 mb-3 position-relative">
            <label className="form-label">Postcode</label>
            <input
                type="text"
                className="form-control form-control-sm"
                value={service.post_code || ""}
                onChange={(e) => {
                handleServiceChange(index, "post_code", e.target.value);
                fetchServiceAddresses(e.target.value, index);
                }}
            />
            {/* Suggestions dropdown */}
            {serviceSuggestions[index] && serviceSuggestions[index].length > 0 && (
                <div className="suggestions-dropdown border position-absolute bg-white w-100" style={{ zIndex: 1000 }}>
                {serviceSuggestions[index].map((sugg) => (
                    <div
                    key={sugg.id}
                    className="p-2 suggestion-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => selectAddressForServices(sugg.id, index)}
                    >
                    {sugg.address}  
                    </div>
                ))}
                </div>
            )}
          </div>

          <div className="row">

             <div className="col-md-3 mb-3">
              <label className="form-label">Place</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={service.place || ""}
                onChange={(e) =>
                  {
                    handleServiceChange(index, "place", e.target.value)
                    selectAddressForServices(e.target.value, index)
                  }
                }
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={service.address || ""}
                onChange={(e) =>
                 { handleServiceChange(index, "address", e.target.value)
                  selectAddressForServices(e.target.value, index)}
                }
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Contact Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={service.facility_contact_name || ""}
                onChange={(e) =>
                  handleServiceChange(index, "facility_contact_name", e.target.value)
                }
              />
            </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Landline No</label>
              <PhoneInput
                country={"gb"}
                value={service.landline_no || ""}
                onChange={(value, countryData) =>
                 {
                   handleServiceChange(index, "landline_no", value || "");
                   handleServiceChange(index, "landline_code", countryData.dialCode);
                }
                }
                 containerClass="w-100"
                inputClass={`form-control form-control-sm w-100`}
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Mobile No</label>
              <PhoneInput
                country={"gb"}
                value={service.mobile_no || ""}
                onChange={(value, countryData) =>
                 { 
                  handleServiceChange(index, "mobile_no", value || "");
                  handleServiceChange(index, "mobile_code", countryData.dialCode);
                  }
                }
                containerClass="w-100"
                inputClass={`form-control form-control-sm w-100`}
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Care Type</label>
              <select
                className="form-select form-select-sm"
                value={service.care_type || ""}
                onChange={(e) => handleServiceChange(index, "care_type", e.target.value)}
            >
                <option value="">Select Care Type</option>
                {options.care_facility.map((facility, idx) => (
                <option key={idx} value={facility.id}>
                    {facility.facility_name || facility.care_type}
                </option>
                ))}
            </select>
            </div>

            <div className="col-md-3 mb-3">
            <label htmlFor="">Client Needs</label>
                <Select
                    isMulti
                    options={options.client_need.map((need) => ({
                        value: need.id,  
                        label: need.name,
                    }))}
                    value={
                    (service.client_need
                        ? service.client_need.toString().split(",").map(id => Number(id)) 
                        : []
                    ).map(id => {
                        const found = options.client_need.find(opt => opt.id === id);
                        return found ? { value: found.id, label: found.name } : null;
                    }).filter(Boolean)
                    }

                    onChange={(selected) => {
                        const ids = selected ? selected.map(opt => opt.value) : [];
                        handleServiceChange(index, "client_need", ids); 
                    }}
                    classNamePrefix="react-select"
                    placeholder="Select client needs..."
                    
                    />

                    </div>

                </div>
                </div>
            ))
            )}

            {serviceData.length > 0 && (
            <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => handleSubmit("service")}
                disabled={loading}
            >
                {loading ? "Saving..." : "Update Service Info"}
            </button>
            )}
        </div>
        )}


            {activeTab === "finance" && (
              <div>
                <h6 style={{
                    color: "#0097EC",
                    textDecoration: "underline"
                }}>Finance Contact Details</h6>
                <div className="container-fluid">
        <div className="row">
            <div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Name <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("finance_name", profileData.finance_name || "")}`}
                value={profileData.finance_name || ""}
                onChange={handleChange("finance","finance_name")}
                // placeholder="Enter Client Organisation"
                required
            />
            </div>
            <div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Position <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("finance_position", profileData.finance_position || "")}`}
                value={profileData.finance_position || ""}
                onChange={handleChange("finance","finance_position")}
                required
            />
            </div>
            <div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Number <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("finance_no", profileData.finance_no || "")}`}
                value={profileData.finance_no || ""}
                onChange={handleChange("finance","finance_no")}
                required
            />
            </div>
              </div>

              <div className="row">
                <div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Address <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("finance_entity_address", profileData.finance_entity_address || "")}`}
                value={profileData.finance_entity_address || ""}
                onChange={handleChange("finance","finance_entity_address")}
                required
            />
            </div><div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Email <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("finance_email", profileData.finance_email || "")}`}
                value={profileData.finance_email || ""}
                onChange={handleChange("finance","finance_email")}
                required
            />
            </div><div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Mobile <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("finance_mobile", profileData.finance_mobile || "")}`}
                value={profileData.finance_mobile || ""}
                onChange={handleChange("finance","finance_mobile")}
                required
            />
            </div>
              </div>
              <div className="row">
                <div className="mb-3 mt-3 col-md-4 col-sm-12">
                <label className="form-label">
                Credit Limit <i className="text-danger">*</i>
               </label>
                <input
                type="number"
                className={`form-control form-control-sm ${getClass("finance_cradit_limit", profileData.finance_cradit_limit || "")}`}
                value={profileData.finance_cradit_limit || ""}
                onChange={handleChange("finance","finance_cradit_limit")}
                required
            />
                </div>
              </div>
            </div>

              <h6 style={{
                color: "#0097EC",
                textDecoration: "underline"
              }} className="mt-3">Billing Contact Details
              </h6>

            <div className="container-fluid">

              <div className="row">
            <div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Billing Name <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("billing_name", profileData.billing_name || "")}`}
                value={profileData.billing_name || ""}
                onChange={handleChange("finance","billing_name")}
                // placeholder="Enter Client Organisation"
                required
            />
            </div>
            <div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Position <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("billing_position", profileData.billing_position || "")}`}
                value={profileData.billing_position || ""}
                onChange={handleChange("finance","billing_position")}
                required
            />
            </div>
            <div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Number <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("billing_number", profileData.billing_number || "")}`}
                value={profileData.billing_number || ""}
                onChange={handleChange("finance","billing_number")}
                required
            />
            </div>
              </div>

              <div className="row">
                <div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Address <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("billing_entity_address", profileData.billing_entity_address || "")}`}
                value={profileData.billing_entity_address || ""}
                onChange={handleChange("finance","billing_entity_address")}
                required
            />
            </div><div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Email <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("billing_email", profileData.billing_email || "")}`}
                value={profileData.billing_email || ""}
                onChange={handleChange("finance","billing_email")}
                required
            />
            </div><div className="mb-3 mt-3 col-md-4 col-sm-12">
            <label className="form-label">
                Mobile <i className="text-danger">*</i>
            </label>
            <input
                type="text"
                className={`form-control form-control-sm ${getClass("billing_mobile", profileData.billing_mobile || "")}`}
                value={profileData.billing_mobile || ""}
                onChange={handleChange("finance","billing_mobile")}
                required
            />
            </div>
            </div>
              </div>
              <div className="row mt-4 ml-1">
        <div className="col-12 ">
            <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() => handleSubmit("finance")}
            disabled={loading}
            >
            {loading ? "Saving..." : "Update Finance"}
            </button>
           </div>
        </div>
              </div>
            )}

            {activeTab === "payrate" && (
              <div>
                <h5>Payrate Info</h5>
                <p>Payrate details will load here.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Edituser;