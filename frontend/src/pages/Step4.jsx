import { useState } from "react";

function Step4({ nextStep, prevStep, handleChange, values }) {

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="card-body">
      <form
        onSubmit={(e) => {
            e.preventDefault();
           if (!acceptedTerms) {
            setError("You must accept to proceed further.");
            return;
          }
          setError("");
          nextStep();
        }}
      >
        <div className="row">
          <div className="form-group col-md-12 col-sm-6">
            <h4>
              <i>
                <label>Thank You for Your Interest to associate with Nightingale Care</label>
              </i>
            </h4>
          </div>

          {/* Advert Reference */}
          <div className="form-group col-md-6 col-sm-6">
            <label>
              Advert Reference <i className="text-danger">*</i>
            </label>
            <select
              className="default-select form-control wide mb-2"
              name="advert_ref"
              id="advert_ref"
              value={values.advert_ref || ""}
              onChange={handleChange("advert_ref")}
              required
            >
              <option value="">-Select-</option>
              <option value="1">Search Engine</option>
              <option value="2">Referral</option>
              <option value="3">Nightingale Care Email</option>
              <option value="4">Other</option>
              <option value="10">Social Media</option>
            </select>
          </div>

          {/* Conditional: Search Engine */}
          {values.advert_ref === "1" && (
            <div className="col-md-6 form-group">
              <label>
                Search Engine Name<i className="text-danger">*</i>
              </label>
              <textarea
                className="form-control"
                id="engine_name"
                name="engine_name"
                value={values.engine_name || ""}
                onChange={handleChange("engine_name")}
                placeholder="Please specify"
                required
              />
            </div>
          )}

          {/* Conditional: Social Media */}
          {values.advert_ref === "10" && (
            <div className="col-md-6 form-group">
              <label>
                Social Media<i className="text-danger">*</i>
              </label>
              <select
                className="default-select form-control wide mb-2"
                name="media_name"
                id="media_name"
                value={values.media_name || ""}
                onChange={handleChange("media_name")}
                required
              >
                <option value="">Select</option>
                <option value="TikTok">TikTok</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="X">X</option>
              </select>
            </div>
          )}

          {/* Conditional: Other */}
          {values.advert_ref === "4" && (
            <div className="col-md-6 form-group">
              <label>
                Other Details<i className="text-danger">*</i>
              </label>
              <textarea
                className="form-control"
                id="other_detail"
                name="other_detail"
                value={values.other_detail || ""}
                onChange={handleChange("other_detail")}
                placeholder="Please specify"
                required
              />
            </div>
          )}

          <div className="form-group col-md-12 mb-3">
  <div className="card p-3 border-secondary">
    <div className="form-check">
      <input
        className="form-check-input mt-1"
        type="checkbox"
        id="termsCheck"
        checked={acceptedTerms}
        onChange={(e) => setAcceptedTerms(e.target.checked)}
      />
      <label className="form-check-label ms-2" htmlFor="termsCheck">
        <strong>GDPR Consent <span className="text-danger">*</span></strong>
        <p className="small text-muted mb-0">
          I confirm that the information I have provided is accurate, and I consent to the collection, 
          processing, and storage of my data in accordance with the General Data Protection Regulation (GDPR). 
          I understand that my data may be used for the purpose of recruitment, compliance checks, 
          and communication related to work opportunities.
          
        </p>
      </label>
    </div>
    {error && <p className="text-danger mt-1">{error}</p>}
  </div>
</div>
</div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={prevStep}
          >
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default Step4;
