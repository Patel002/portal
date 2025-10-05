import { useState, useEffect } from "react";
import useCandidateOptions from "../hooks/useCandidateOptions";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Confirmation from "./Step5";
import "../css/StepForm.css";

const RegisterCandidate = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    candidate_name: "",
    post_code: "",
    address_line_1: "",
    landlineNo: "",
    mobile_number: "",
    place: "",
    email_id: "",
    candidate_dob: "",
    profile_img: "",
    upload_cv: "",
    passport: "",
    driver_car_owner: "",
    dbs: "",
    dbs_workforce_type: "",
    current_salary: "",
    desired_salary: "",
    notice_period: "",
    current_position: "",
    current_company_name: "",
    w_u_consider: "",
    emergency_shift: "",
    engine_name: "",
    reason_for_leave: "",
    is_visa_for_uk: "",
    other_passport: "",
    experience: "",
    media_name: "",
    advert_ref: "",
    jobTitle: [],
    countryCode: "",
    skills: [],
    clientNeeds: [],
    careFacility: [],
  });

  console.log(formData)
  const [touched, setTouched] = useState({});
  const {
    jobTitleQuery,
    countryCodeQuery,
    skillsQuery,
    careFacilityQuery,
    clientNeedsQuery,
    isLoading,
  } = useCandidateOptions();


  // if (isLoading) return <h3>Loading...</h3>;
  // if (isError) return <h3>Error loading options</h3>;

  const options = {
    jobTitle: jobTitleQuery.data || [],
    countryCode: countryCodeQuery.data || [],
    skills: skillsQuery.data || [],
    careFacility: careFacilityQuery.data || [],
    clientNeeds: clientNeedsQuery.data || []
  };



  // useEffect(() => {
  //   localStorage.setItem("currentStep", step);
  // }, [step]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const goToStep = (targetStep) => setStep(targetStep);

  const handleChange = (field) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBlur = (input) => () => {
    setTouched({ ...touched, [input]: true });
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
  // if (isError) return <h3>Error: {error.message}</h3>;

  return (
    <div className="stepForm">
      <div className="container mb-4">
        <div className="card wizard-card" data-color="orange" id="wizardProfile">
          <div className="wizard-header">
            <a href="/" className="brand-logo">
              <img src="/assets/complogo.png" alt="Logo" />
            </a>
            <h3>
              <b>Candidate Registration</b>
            </h3>
          </div>

          <div className="wizard-navigation">
            <ul className="nav nav-pills">
              <li className={step === 1 ? "active" : ""}><a>STEP1</a></li>
              <li className={step === 2 ? "active" : ""}><a>STEP2</a></li>
              <li className={step === 3 ? "active" : ""}><a>STEP3</a></li>
              <li className={step === 4 ? "active" : ""}><a>STEP4</a></li>
              <li className={step === 5 ? "active" : ""}><a>Preview</a></li>
            </ul>
          </div>

          {/* Step content */}
          {step === 1 && (
            <Step1
              nextStep={nextStep}
              handleChange={handleChange}
              values={formData}
              countryCodes={options.countryCode}
              touched={touched}
              handleBlur={handleBlur}
            />
          )}
          {step === 2 && (
            <Step2
              nextStep={nextStep}
              prevStep={prevStep}
              values={formData}
              careFacility={options.careFacility}
              jobTitle={options.jobTitle}
              skills={options.skills}
              clientNeeds={options.clientNeeds}
              handleCheckbox={handleCheckbox}
              handleChange={handleChange}
            />
          )}
          {step === 3 && (
            <Step3
              nextStep={nextStep}
              prevStep={prevStep}
              values={formData}
              handleCheckbox={handleCheckbox}
              handleChange={handleChange}
            />
          )}
          {step === 4 && (
            <Step4
              nextStep={nextStep}
              prevStep={prevStep}
              values={formData}
              handleCheckbox={handleCheckbox}
              handleChange={handleChange}
            />
          )}
          {step === 5 && (
            <Confirmation
              values={formData}
              prevStep={prevStep}
              goToStep={goToStep}
              options={options}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterCandidate;
