import { useState, useEffect, use } from "react";
import useCandidateOptions from "../hooks/useCandidateOptions";
import '../css/ClientReg.css'
import Step1 from "./components/Step1";

const ClientReg = () => {
     const [step, setStep] = useState(() => {
    return parseInt(localStorage.getItem("currentStep")) || 1;
  });

    const [formData, setFormData] = useState({
      candidate_id :"",
      client_organisation :"",
      parent_entity :"",
      post_code :"",
      postal_address :"",
      address_list :"",
      vat_number :"",
      registration_no :"",
      website :"",
      monthly_cost :"",
      subscription :"",
      monthly_payroll :"",
      payroll_timesheet :"",
      no_payroll :"",
      contact_name :"",
      contact_position :"",
      contact_email :"",
      contact_number :"",
      lane_code :"",
      contact_mobile :"",
      mobile_code :"",
      finance_name :"",
      finance_position :"",
      finance_number :"",
      finance_mobile_code :"",
      finance_mobile :"",
      finance_email :"",
      finance_entity_address :"",
      finance_credit_limit :"",
      billing_name :"",
      billing_position :"",
      billing_number :"",
      billing_mobile_code :"",
      billing_mobile :"",
      billing_email :"",
      billing_entity_address :"",
      post_code1 :"",
      place :"",
      address :"",
      type :"",
      entity_name :"",
      care_facility : [],
      client_need : [],
      facility_type_contact_name :"",
      facility_contact_landline_no :"",
      facility_contact_mobile_no :"",
      facility_contact_email :"",
      facility_lane_code :"",
      facility_mobile_code :"",
      shiftid :"",
      sr_1 :"",
      shift_pattern_1 :"",
      shift_type_1 :"",
      shift_start_1 :"",
      shift_end_1 :"",
      remarks_1: ""
    })

    const {
    careFacilityQuery,
    clientNeedsQuery,
    isLoading,
    } = useCandidateOptions();

    const options = {
      careFacility: careFacilityQuery.data || [],
      clientNeeds: clientNeedsQuery.data || []
    }

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);
    const goToStep = (targetStep) => setStep(targetStep)

    const handleChange = (field) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

//   const handleBlur = (input) => () => {
//     setTouched({ ...touched, [input]: true });
//   };

const stepTitles = {
  1: "Client Registration",
  2: "Service Details",
  3: "Finance Details",
  4: "Shift Patterns",
  5: "Pay Rate"
};

  const handleCheckbox = (field, value) => {
    setFormData((prev) => {
      const isChecked = prev[field].includes(value);
      return {
        ...prev,
        [field]: isChecked
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };
    });
  };

  if (isLoading) return <h3>Loading options...</h3>;

  return (
    <div className="ClientStepForm">
      <div className="container wide-container mb-4">
        <div className="card wizard-card" data-color="orange" id="wizardProfile">
          <div className="wizard-header">
            <a href="/" className="brand-logo">
              <img src="/src/assets/complogo.png" alt="Logo" />
            </a>
            <h3>{stepTitles[step]}</h3>
          </div>
          <div className="wizard-navigation">
            <ul className="nav nav-pills">
              <li className={step === 1 ? "active" : ""}><a>STEP1</a></li>
              <li className={step === 2 ? "active" : ""}><a>STEP2</a></li>
              <li className={step === 3 ? "active" : ""}><a>STEP3</a></li>
              <li className={step === 4 ? "active" : ""}><a>STEP4</a></li>
              <li className={step === 5 ? "active" : ""}><a>STEP5</a></li>
            </ul>
          </div>

          {step === 1 && (
            <Step1
              nextStep={nextStep}
              handleChange={handleChange}
              values={formData}
            //   touched={touched}
            //   handleBlur={handleBlur}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientReg;