    import axios from 'axios';
    import showToast from '../helper/toast.js';

    const Confirmation = ({ values, prevStep, goToStep, options }) => {

      const successAudio = new Audio('/src/assets/success.mp3');
      successAudio.load();

      const errorAudio = new Audio('/src/assets/error.mp3');
      errorAudio.load();

      const advertRefOptions = {
        "1": "Search Engine",
        "2": "Referral",
        "3": "Nightingale Care Email",
        "4": "Other",
        "10": "Social Media"
      };


      const getNamesFromIds = (ids, list) => {
        if (!Array.isArray(ids)) return '';
        return ids.map(id => {
          const item = list.find(i => i.id === id);
          return item?.name || item?.facility_name || id;
        }).join(', ');
      };

      const handleSubmit = async () => {

        const formDataToSend = new FormData();

        for (const key in values) {
          if (Array.isArray(values[key])) {
            values[key].forEach(item => formDataToSend.append(key, item));
          } else {
            formDataToSend.append(key, values[key]);
          }
        }

        try {
          const response = await axios.post('https://portal-sddm.onrender.com/api/candidate/candidate', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status === 201 || response.status === 200) {
            showToast("success", "Candidate Added Successfully");
            successAudio.play();
            
            setTimeout(() => {
            window.location.reload();
          }, 2000);
          }

          console.log(response.data);

      } catch (error) {
          if (error.response) {
        console.error("API Error:", error.response.data);
        console.error("Status:", error.response.status);

        showToast("error", error.response.data.message);
        errorAudio.play();
      }
    }
  };


      return (
        <div className="confirmation">
          {/* <h3 className="mb-4">✅ Confirm Your Details Before Submitting</h3> */}

          {/* --- Step 1: Basic Details --- */}
           <div className="card shadow-sm rounded-3 mb-4">
      <div className="card-header text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Step 1: Basic Information</h5>
        {goToStep && (
          <button
            onClick={() => goToStep(1)}
            className="btn btn-light btn-sm"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        )}
      </div>

      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">Full Name</label>
            <p className="fw-semibold">{values.candidate_name || "-"}</p>
          </div>
          <div className="col-md-6">
            <label className="text-muted small">Email</label>
            <p className="fw-semibold">{values.email_id || "-"}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">Mobile Number</label>
            <p className="fw-semibold">{values.mobile_number || "-"}</p>
          </div>
          <div className="col-md-6">
            <label className="text-muted small">Landline Number</label>
            <p className="fw-semibold">{values.landlineNo || "-"}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">Date of Birth</label>
            <p className="fw-semibold">{values.candidate_dob || "-"}</p>
          </div>
          <div className="col-md-6">
            <label className="text-muted small">Post Code</label>
            <p className="fw-semibold">{values.post_code || "-"}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">Address Line 1</label>
            <p className="fw-semibold">{values.address_line_1 || "-"}</p>
          </div>
          <div className="col-md-6">
            <label className="text-muted small">Place</label>
            <p className="fw-semibold">{values.place || "-"}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <label className="text-muted small">Passport</label>
            <p className="fw-semibold">{values.passport || "-"}</p>
          </div>
        </div>
      </div>
    </div>

          <hr />

          {/* --- Step 2: Skills & Interests --- */}
         <div className="card shadow-sm rounded-3 mb-4">
      <div className="card-header text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Step 2: Job Preferences & Skills</h5>
        {goToStep && (
          <button
            onClick={() => goToStep(2)}
            className="btn btn-light btn-sm"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        )}
      </div>

      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">Job Titles</label>
            <p className="fw-semibold">
              {getNamesFromIds(values.jobTitle, options.jobTitle) || "-"}
            </p>
          </div>
          <div className="col-md-6">
            <label className="text-muted small">Skills</label>
            <p className="fw-semibold">
              {getNamesFromIds(values.skills, options.skills) || "-"}
            </p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">Care Facilities</label>
            <p className="fw-semibold">
              {getNamesFromIds(values.careFacility, options.careFacility) || "-"}
            </p>
          </div>
          <div className="col-md-6">
            <label className="text-muted small">Client Needs</label>
            <p className="fw-semibold">
              {getNamesFromIds(values.clientNeeds, options.clientNeeds) || "-"}
            </p>
          </div>
        </div>

        {values.upload_cv && (
          <div className="mb-3">
            <label className="text-muted small">Uploaded CV</label>
            <p className="fw-semibold">
              <a
                href={URL.createObjectURL(values.upload_cv)}
                target="_blank"
                rel="noreferrer"
              >
                {values.upload_cv.name}
              </a>
            </p>
          </div>
        )}

        {values.profile_img && (
          <div>
            <label className="text-muted small d-block">Profile Image</label>
            <img
              src={URL.createObjectURL(values.profile_img)}
              alt="Profile"
              width="150"
              height="150"
              className="rounded border"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    </div>

<hr />
          {/* --- Step 3: Employment Details --- */}
          <div className="card shadow-sm rounded-3 mb-4">
      <div className="card-header text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Step 3: Employment Info</h5>
        {goToStep && (
          <button
            onClick={() => goToStep(3)}
            className="btn btn-light btn-sm"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        )}
      </div>

      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">Current Salary</label>
            <p className="fw-semibold">{values.current_salary || "-"}</p>
          </div>
          <div className="col-md-6">
            <label className="text-muted small">Desired Salary</label>
            <p className="fw-semibold">{values.desired_salary || "-"}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">Experience</label>
            <p className="fw-semibold">{values.experience || "-"}</p>
          </div>
          <div className="col-md-6">
            <label className="text-muted small">Notice Period</label>
            <p className="fw-semibold">{values.notice_period || "-"}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">Current Position</label>
            <p className="fw-semibold">{values.current_position || "-"}</p>
          </div>
          <div className="col-md-6">
            <label className="text-muted small">Reason for Leaving</label>
            <p className="fw-semibold">{values.reason_for_leave || "-"}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">DBS</label>
            <p className="fw-semibold">{values.dbs || "-"}</p>
          </div>
          <div className="col-md-6">
            <label className="text-muted small">Driver / Car Owner</label>
            <p className="fw-semibold">{values.driver_car_owner || "-"}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">Eligible to Work in UK</label>
            <p className="fw-semibold">{values.is_visa_for_uk || "-"}</p>
          </div>
          <div className="col-md-6">
            <label className="text-muted small">Would you consider relocation?</label>
            <p className="fw-semibold">{values.w_u_consider || "-"}</p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="text-muted small">Emergency Shift Availability</label>
            <p className="fw-semibold">{values.emergency_shift || "-"}</p>
          </div>
        </div>

        {values.passport && (
          <div className="mb-3">
            <label className="text-muted small">Passport</label>
            <p className="fw-semibold">{values.passport.name}</p>
          </div>
        )}
      </div>
    </div>


          <hr />

          {/* --- Step 4: Documents --- */}
          <div className="card shadow-sm rounded-3 mb-4">
      <div className="card-header text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Step 4: Reference</h5>
        {goToStep && (
          <button
            onClick={() => goToStep(4)}
            className="btn btn-light btn-sm"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        )}
      </div>

      <div className="card-body">
        <div className="row mb-2">
          <div className="col-md-6">
            <label className="text-muted small">Advert Reference</label>
            <p className="fw-semibold">{advertRefOptions[values.advert_ref] || "-"}</p>
          </div>
        </div>
        {values.advert_ref === "1" && (
  <div className="row mb-2">
    <div className="col-md-6">
      <label className="text-muted small">Search Engine Name</label>
      <p className="fw-semibold">{values.engine_name || "-"}</p>
    </div>
  </div>
)}

{values.advert_ref === "10" && (
  <div className="row mb-2">
    <div className="col-md-6">
      <label className="text-muted small">Social Media</label>
      <p className="fw-semibold">{values.media_name || "-"}</p>
    </div>
  </div>
)}

{values.advert_ref === "4" && (
  <div className="row mb-2">
    <div className="col-md-6">
      <label className="text-muted small">Other Details</label>
      <p className="fw-semibold">{values.other_detail || "-"}</p>
    </div>
  </div>
)}
      </div>
    </div>

          <hr />

          {/* Submit or Back */}
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      );
    };

    export default Confirmation;
