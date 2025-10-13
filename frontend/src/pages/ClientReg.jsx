import { useState, useEffect } from "react";
import useCandidateOptions from "../hooks/useCandidateOptions";
import axios from "axios";
import '../css/ClientReg.css'
import showToast from "../helper/toast";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import LoaderScreen from "./components/Loader";

const ClientReg = () => {

  const successAudio = new Audio('/assets/success.mp3');
  const errorAudio = new Audio('/assets/error.mp3');

  const Api_base_Url = import.meta.env.VITE_API_BASE;


     const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
      client_id :"",
      client_organisation :"",
      parent_entity :"",
      post_code :"",
      postal_address :"",
      address_list :"",
      vat_number :"",
      registration_no :"",
      client_logo :"",
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
      step2_data: [],
      shift_pattern: [],
      payrate: [],
    })

    useEffect(() => {
  // console.log("Updated formData:", formData);
}, [formData]);


// useEffect(() => {
//   localStorage.setItem("currentStep", step);
// }, [step]);

    const {
    careFacilityQuery,
    clientNeedsQuery,
    jobTitleQuery,
    isLoading,
    } = useCandidateOptions();

    const options = {
      care_facility: careFacilityQuery.data || [],
      client_need: clientNeedsQuery.data || [],
      job_title: jobTitleQuery.data || [],
    }

    // console.log("Options:", options);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);
    // const goToStep = (targetStep) => setStep(targetStep)
    

    const handleChange = (field) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

const handleStep2Change = (newStep2Data) => {
  setFormData((prev) => ({
    ...prev,
    step2_data: newStep2Data,
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

const token = sessionStorage.getItem("token");
// console.log("Token:", token);
  const submitForm= async () => {
    try {
      const response = await axios.post(`${Api_base_Url}/client/save-client`, formData,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Form submitted successfully:', response.data);
       if (response.status === 200 || response.status === 201) {
        showToast("success","Client Registered Successfully");
        successAudio.play();
        setFormData({
        candidate_id :"",
        client_organisation :"",
        parent_entity :"",
        post_code :"",
        postal_address :"",
        address_list :"",
        vat_number :"",
        registration_no :"",
        client_logo :"",
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
        step2_data: [],
        shift_pattern: [],
        payrate: [],
        });
        setStep(1);
        localStorage.removeItem("currentStep");
        
       }
    } catch (error) {
      showToast("error","Error in Client Registration");
      errorAudio.play();
      console.error('Error submitting form:', error);
    }

  }

  if (isLoading) return <LoaderScreen message="Loading client options..." />;


  return (
    <div className="ClientStepForm">
      <div className="container wide-container mb-4">
        <div className="card wizard-card" data-color="orange" id="wizardProfile">
          <div className="wizard-header">
            <a href="/" className="brand-logo">
              <img src="/assets/complogo.png" alt="Logo" />
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

<div className="wizard-content">
          {step === 1 && (
            <Step1
              nextStep={nextStep}
              handleChange={handleChange}
              values={formData}
            />
          )}
           {step === 2 && (
            <Step2
              nextStep={nextStep}
              prevStep={prevStep}
              values={formData}
              careFacility={options.care_facility}
              clientNeeds={options.client_need}
              handleStep2Change={handleStep2Change} 
            />
          )}
           
           {step === 3 && (
            <Step3
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
            values={formData}
            />
           )}

           {step === 4 && (
            <Step4
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
            values={formData}
            />
           )}

           {step === 5 && (
            <Step5
            // nextStep={nextStep}
            prevStep={prevStep}
            jobTitle={options.job_title}
            handleChange={handleChange}
            values={formData}
            submitForm={submitForm}
            />
           )}
           </div>
        </div>
      </div>
    </div>
  );
}

export default ClientReg;