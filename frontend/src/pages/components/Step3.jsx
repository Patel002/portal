import { useState, useEffect } from "react";

const Step3 = ({ nextStep, prevStep, handleChange, values }) => {
 const useMainForFinance = values.useMainForFinance || false;
const useMainForBilling = values.useMainForBilling || false;
const useFinanceForBilling = values.useFinanceForBilling || false;



  useEffect(() => {
    if (useMainForFinance) {
      handleChange("finance_name")(values.contact_name);
      handleChange("finance_position")(values.contact_position);
      handleChange("finance_mobile")(values.contact_mobile);
      handleChange("finance_email")(values.contact_email);
      handleChange("finance_entity_address")(values.address_list);
      handleChange("finance_mobile_code")(values.mobile_code);
      handleChange("finance_number")(values.contact_number);
    } else {
      handleChange("finance_name")("");
      handleChange("finance_position")("");
      handleChange("finance_number")("");
      handleChange("finance_mobile")("");
      handleChange("finance_email")("");
      handleChange("finance_entity_address")("");
      handleChange("finance_mobile_code")("");
      handleChange("finance_credit_limit")("");
    }
  }, [useMainForFinance]);

  useEffect(() => {
    if (useMainForBilling) {
      handleChange("billing_name")(values.contact_name);
      handleChange("billing_position")(values.contact_position);
      handleChange("billing_number")(values.contact_number);
      handleChange("billing_mobile")(values.contact_mobile);
      handleChange("billing_email")(values.contact_email);
      handleChange("billing_entity_address")(values.address_list);
      handleChange("billing_mobile_code")(values.mobile_code);
    } else if (!useFinanceForBilling) {
      handleChange("billing_name")("");
      handleChange("billing_position")("");
      handleChange("billing_number")("");
      handleChange("billing_mobile")("");
      handleChange("billing_email")("");
      handleChange("billing_entity_address")("");
      handleChange("billing_mobile_code")("");
    }
  }, [useMainForBilling, useFinanceForBilling]);

  useEffect(() => {
    if (useFinanceForBilling) {
      handleChange("billing_name")(values.finance_name);
      handleChange("billing_position")(values.finance_position);
      handleChange("billing_number")(values.finance_number);
      handleChange("billing_mobile")(values.finance_mobile);
      handleChange("billing_email")(values.finance_email);
      handleChange("billing_entity_address")(values.finance_entity_address);
      handleChange("billing_mobile_code")(values.finance_mobile_code);
    }
  }, [useFinanceForBilling, values.finance_name, values.finance_position, values.finance_number, values.finance_mobile, values.finance_email, values.finance_entity_address, values.finance_mobile_code]);

  const renderInput = (label, field, type = "text") => (
    <div className="col-md-4">
      <div className="form-group">
        <label>{label}</label>
        <input
          type={type}
          className="form-control form-control-sm"
          value={values[field] || ""}
          onChange={handleChange(field)}
          required
        />
      </div>
    </div>
  );

  const renderTextarea = (label, field) => (
    <div className="col-md-4">
      <div className="form-group">
        <label>{label}</label>
        <input
          className="form-control form-control-sm"
          value={values[field] || ""}
          onChange={handleChange(field)}
          required
        />
      </div>
    </div>
  );

  return (
    <div className="step3-form">
      {/* Finance Section */}
      <h6>Finance Details</h6>
      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="useMainFinance"
          checked={useMainForFinance}
          onChange={(e) => handleChange("useMainForFinance")(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="useMainFinance">
          Same as Main Contact Details
        </label>
      </div>

      <div className="row">
        {renderInput("Name", "finance_name")}
        {renderInput("Position", "finance_position")}
        {renderInput("Number", "finance_number")}
      </div>
      <div className="row">
       {renderTextarea("Address", "finance_entity_address")}
        {renderInput("Mobile", "finance_mobile")}
        {renderInput("Email", "finance_email", "email")}
      </div>
      <div className="row">
        {renderInput("Credit Limit", "finance_credit_limit", "number")}
      </div>

      <hr />

      {/* Billing Section */}
      <h6>Billing Details</h6>
      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="useMainBilling"
          checked={useMainForBilling}
          onChange={(e) => {
            handleChange("useMainForBilling")(e.target.checked);
            if (e.target.checked) handleChange("useFinanceForBilling")(false);
          }}
        />
        <label className="form-check-label" htmlFor="useMainBilling">
          Same as Main Contact Details
        </label>
      </div>

      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="useFinanceBilling"
          checked={useFinanceForBilling}
          onChange={(e) => {
            handleChange("useFinanceForBilling")(e.target.checked);
            if (e.target.checked)
              handleChange("useMainForBilling")(false);
          }}
        />
        <label className="form-check-label" htmlFor="useFinanceBilling">
          Same as Finance Details
        </label>
      </div>

      <div className="row">
        {renderInput("Name", "billing_name")}
        {renderInput("Position", "billing_position")}
        {renderInput("Number", "billing_number")}
      </div>
      <div className="row">
        {renderTextarea("Address", "billing_entity_address")}
        {renderInput("Mobile", "billing_mobile")}
        {renderInput("Email", "billing_email", "email")}
      </div>
      <div className="row">
        
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-secondary mr-2" onClick={prevStep}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={nextStep}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3;
