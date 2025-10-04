// import { useState } from "react";

function Step3({ nextStep, prevStep, handleChange, values }) {
  return (
    <div className="card-body">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          nextStep();
        }}
      >
        <div className="row">
          {/* Driver / Car Owner */}
          <div className="form-group col-md-4 col-sm-4">
            <label>
              Driver / Car Owner<i className="text-danger">*</i>
            </label>
            <select
              className="default-select form-control wide mb-2"
              name="driver_car_owner"
              value={values.driver_car_owner || ""}
              onChange={handleChange("driver_car_owner")}
              required
            >
              <option value="">-Select-</option>
              <option value="Can drive, with own car">
                Can drive, with own car
              </option>
              <option value="Can drive, no car">Can drive, no car</option>
              <option value="Can't drive">Can't drive</option>
            </select>
          </div>

          {/* DBS */}
          <div className="form-group col-md-4 col-sm-4">
            <label>
              DBS <i className="text-danger">*</i>{" "}
              <i
                className="fas fa-info-circle"
                title="Please confirm your current DBS Status (no need to upload at this stage)"
              ></i>
            </label>
            <select
              className="default-select form-control wide mb-2"
              name="dbs"
              value={values.dbs || ""}
              onChange={(e) => {
                handleChange("dbs")(e);
                if(!e.target.value || e.target.value === 'NO DBS'){
                  handleChange("dbs_workforce_type")({ target: { value: "" } });
                }
              }}
              required
            >
              <option value="">-Select-</option>
              <option value="NO DBS">NO DBS</option>
              <option value="Current DBS Number">Current DBS Number</option>
              <option value="Any Disclosures">Any Disclosures</option>
              <option value="Registered for online update service">
                Registered for online update service
              </option>
            </select>
          </div>

          <div className="form-group col-md-4 col-sm-4">
            <label>
              DBS Workforce Type <i className="text-danger">*</i>{" "}
              <i
                className="fas fa-info-circle"
                title="Please confirm your current DBS Workforce Type"
              ></i>
            </label>
            <select
              className="default-select form-control wide mb-2"
              name="dbs"
              value={values.dbs_workforce_type || ""}
              onChange={handleChange("dbs_workforce_type")}
              disabled={!values.dbs || values.dbs === "NO DBS"}
              required={values.dbs && values.dbs !== "NO DBS"}
            >
              <option value="">-Select-</option>
              <option value="Adult">Adult</option>
              <option value="Children">Children</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div className="col-12 mt-4"></div>

          {/* Current Hourly Rate */}
          <div className="form-group col-md-4 col-sm-4">
            <label>
              Current Hourly Rate <i className="text-danger">*</i>{" "}
              <i
                className="fas fa-info-circle"
                title="Please specify your higher rate if you work with multiple services "
              ></i>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Current Hourly Rate"
              value={values.current_salary || ""}
              onChange={handleChange("current_salary")}
              min="0"
              required
            />
          </div>

          {/* Desired Hourly Rate */}
          <div className="form-group col-md-4 col-sm-4">
            <label>
              Desired Hourly Rate <i className="text-danger">*</i>{" "}
              <i
                className="fas fa-info-circle"
                title="Please specify the minimum hourly rate you would accept"
              ></i>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Desired Hourly Rate"
              value={values.desired_salary || ""}
              onChange={handleChange("desired_salary")}
              min="0"
              required
            />
          </div>

          {/* Notice Period */}
          <div className="form-group col-md-4 col-sm-4">
            <label>
              Notice Period<i className="text-danger">*</i>{" "}
              <i className="text">(In Weeks)</i>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Notice Period"
              value={values.notice_period || ""}
              onChange={handleChange("notice_period")}
              min="0"
              required
            />
          </div>

          <div className="col-12 mt-4"></div>

          {/* Reason for leaving */}
          <div className="form-group col-md-4 col-sm-4">
            <label>
              Reason for leaving<i className="text-danger">*</i>
            </label>
            <select
              className="default-select form-control wide mb-2"
              name="reason_for_leave"
              value={values.reason_for_leave || ""}
              onChange={handleChange("reason_for_leave")}
              required
            >
              <option value="">-Select-</option>
              <option value="Higher Hourly Rate">Higher Hourly Rate</option>
              <option value="Work Closer To Home">Work Closer To Home</option>
              <option value="Require More Hours From Current Per Week">
                Require More Hours From Current Per Week
              </option>
              <option value="Moving From Current Location">
                Moving From Current Location
              </option>
              <option value="Want to work in different client groups">
                Want to work in different client groups
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Most Recent / Current Position */}
          <div className="form-group col-md-4 col-sm-4">
            <label>
              Current Job Title
              <i className="text-danger">*</i>{" "}
              <i
                className="fas fa-info-circle"
                title="Please only specify the care home and not an agency you work for. Include all if you work for multiple homes."
              ></i>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Current Job Title"
              value={values.current_position || ""}
              onChange={handleChange("current_position")}
              required
            />
          </div>
          <div className="form-group col-md-4 col-sm-6">
            <label>
              Current employer
              <small> Company Name </small>{" "}
              <i className="text-danger">*</i>{" "}
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Name of Current employer"
              value={values.current_company_name || ""}
              onChange={handleChange("current_company_name")}
              required
            />
          </div>

          <div className="col-12 mt-4"></div>

          {/* Permanent Role */}
          <div className="form-group col-md-4 col-sm-6">
            <label className="form-label">
              Would You Consider Permanent Role? <i className="text-danger">*</i>{" "}
              <i
                className="fas fa-info-circle"
                title="This also includes if you would consider to be a permanent bank staff for a service."
              ></i>
            </label>
            <br />

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="w_u_consider1"
                name="w_u_consider"
                value="Yes"
                checked={values.w_u_consider === "Yes"}
                onChange={handleChange("w_u_consider")}
                required
              />
              <label className="form-check-label" htmlFor="w_u_consider1">
                Yes
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="w_u_consider2"
                name="w_u_consider"
                value="No"
                checked={values.w_u_consider === "No"}
                onChange={handleChange("w_u_consider")}
                required
              />
              <label className="form-check-label" htmlFor="w_u_consider2">
                No
              </label>
            </div>
          </div>

          {/* Emergency Shifts */}
          <div className="form-group col-md-4 col-sm-6">
            <label className="form-label">
              Are you available for emergency shifts?{" "}
              <i className="text-danger">*</i>
            </label>
            <br />

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="available_for_emergency1"
                name="emergency_shift"
                value="Yes"
                checked={values.emergency_shift === "Yes"}
                onChange={handleChange("emergency_shift")}
                required
              />
              <label
                className="form-check-label"
                htmlFor="available_for_emergency1"
              >
                Yes
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="available_for_emergency2"
                name="emergency_shift"
                value="No"
                checked={values.emergency_shift === "No"}
                onChange={handleChange("emergency_shift")}
                required
              />
              <label
                className="form-check-label"
                htmlFor="available_for_emergency2"
              >
                No
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
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

export default Step3;
