import { useState, useRef } from "react";

function Step2({ nextStep, handleChange, values, careFacility, jobTitle, skills, clientNeeds, handleCheckbox, prevStep }) {
   
    const [errors, setErrors] = useState({});
    const [fileName, setFileName] = useState("");
    const [photoName, setPhotoName] = useState("");
    const [cameraOpen, setCameraOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);



    const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      handleChange("upload_cv")({ target: { value: file } });
    }
  };

   const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoName(file.name);
      setPreview(URL.createObjectURL(file));
      handleChange("profile_img")({ target: { value: file } });
    }
  };

   const openCamera = async () => {
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };


  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });
        setPhotoName(file.name);
        setPreview(URL.createObjectURL(file));
        handleChange("profile_img")({ target: { value: file } });
      }, "image/jpeg");
    }
    // Stop camera
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    setCameraOpen(false);
  };


  return (
    <div className="card-body">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newErrors = {};

  if (!values.careFacility || values.careFacility.length === 0) {
    newErrors.careFacility = "Please select at least one care facility";
  }
  if (!values.clientNeeds || values.clientNeeds.length === 0) {
    newErrors.clientNeeds = "Please select at least one client group experience";
  }
  if (!values.jobTitle || values.jobTitle.length === 0) {
    newErrors.jobTitle = "Please select at least one job title";
  }
  if (!values.skills || values.skills.length === 0) {
    newErrors.skills = "Please select at least one skill";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

          nextStep();
        }}
      >
        {/* Row 1: Experience, Resume, Photo */}
        <div className="row">
          <div className="mb-3 col-md-4 col-sm-6">
            <label className="form-label">
              Experience <i className="text-danger">*</i>
            </label>
            <select
              className="form-select"
              value={values.experience || ""}
              onChange={handleChange("experience")}
              required
            >
              <option value="">-Select-</option>

              <option value="NE">No Experience</option>

              <option value="0-6">0-6 Month</option>

              <option value="6-12">6-12 Month</option>

              <option value="1-3">1-3 Years</option>

              <option value="5">5 Years</option>
            </select>
          </div>

          <div className="mb-3 col-md-4 col-sm-6">
            <label className="form-label">
              Upload Resume <i className="text-danger">*</i>
            </label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              required
            />
          </div>

       <div className="mb-3 col-md-4 col-sm-6">
  <label className="form-label">Upload Photo</label>

  {/* Row for file input and camera button */}
  <div className="d-flex gap-2 mb-2">
    <input
      type="file"
      className="form-control"
      accept="image/*"
      onChange={handlePhotoUpload}
    />
    <button
      type="button"
      className="btn btn-primary w-95 btn-sm"
      onClick={openCamera}
    >
      Camera
    </button>
  </div>

  {/* Preview */}
  {preview && (
    <div className="mt-2">
      <img
        src={preview}
        alt="Preview"
        className="img-thumbnail"
        style={{ maxWidth: "150px" }}
      />
      <p className="text-success mb-0">Uploaded: {photoName}</p>
    </div>
  )}

  {/* Camera Modal */}
  {cameraOpen && (
    <div className="camera-modal mt-2">
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
      <button
        type="button"
        className="btn btn-success mt-2 w-100"
        onClick={capturePhoto}
      >
        Capture
      </button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )}
</div>


    </div>

        {/* Divider */}
        <div className="my-4">
          <hr />
          <h5 className="text-center">CARE FACILITY<i className="text-danger">*</i></h5>
          <hr />
        </div>

        {/* Care Facilities Checkboxes */}
        {Array.isArray(careFacility) && careFacility.length > 0 ? (
        <div className="row">
          {careFacility.map((facility, index) => (
            <div className="mb-2 col-md-4 col-sm-6" key={index}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`facility-${facility.id}`}
                  value={facility.id}
                  checked={values.careFacility.includes(facility.id)}
                  onChange={() => handleCheckbox("careFacility", facility.id)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`facility-${facility.id}`}
                >
                  {facility.facility_name}
                </label>
              </div>
            </div>
          ))}
           {errors.careFacility && (
          <p className="text-danger mt-1">{errors.careFacility}</p>
        )}
        </div>
      ) : (
        <p className="text-muted">Loading facilities...</p>
      )}


      <div className="my-4">
          <hr />
          <h5 className="text-center">CLIENT GROUP EXPERIENCE<i className="text-danger">*</i></h5>
          <hr />
        </div>

        {Array.isArray(clientNeeds) && clientNeeds.length > 0 ? (
        <div className="row">
          {clientNeeds.map((clientNeeds, index) => (
            <div className="mb-2 col-md-4 col-sm-6" key={index}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`clientNeeds-${clientNeeds.id}`}
                  value={clientNeeds.id}
                  checked={values.clientNeeds?.includes(clientNeeds.id)}
                  onChange={() => handleCheckbox("clientNeeds", clientNeeds.id)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`clientNeeds-${clientNeeds.id}`}
                >
                  {clientNeeds.name}
                </label>       
              </div>
            </div>
          ))}
           {errors.clientNeeds && (
          <p className="text-danger mt-1">{errors.clientNeeds}</p>
        )}
        </div>
      ) : (
        <p className="text-muted">Loading client needs...</p>
      )}

 <div className="my-4">
          <hr />
          <h5 className="text-center">JOB TITLES<i className="text-danger">*</i></h5>
          <hr />
        </div>

        {Array.isArray(jobTitle) && jobTitle.length > 0 ? (
        <div className="row">
          {jobTitle.map((jobTitles, index) => (
            <div className="mb-2 col-md-4 col-sm-6" key={index}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`jobTitles-${jobTitles.id}`}
                  value={jobTitles.id}
                  checked={values.jobTitle?.includes(jobTitles.id)}
                  onChange={() => handleCheckbox("jobTitle", jobTitles.id)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`jobTitles-${jobTitles.id}`}
                >
                  {jobTitles.name}
                </label>
              </div>
            </div>
          ))}
          {errors.jobTitle && (
          <p className="text-danger mt-1">{errors.jobTitle}</p>
        )}
        </div>
      ) : (
        <p className="text-muted">Loading job titles...</p>
      )}


      <div className="my-4">
          <hr />
          <h5 className="text-center">SKILLS<i className="text-danger">*</i></h5>
          <hr />
        </div>

        {Array.isArray(skills) && skills.length > 0 ? (
        <div className="row">
          {skills.map((skills, index) => (
            <div className="mb-2 col-md-4 col-sm-6" key={index}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`skills-${skills.id}`}
                  value={skills.id}
                  checked={values.skills?.includes(skills.id)}
                  onChange={() => handleCheckbox("skills", skills.id)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`skills-${skills.id}`}
                >
                  {skills.name}
                </label>
              </div>
            </div>
          ))}
          {errors.skills && (
          <p className="text-danger mt-1">{errors.skills}</p>
        )}
        </div>
      ) : (
        <p className="text-muted">Loading skills...</p>
      )}


        {/* Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={prevStep}
          >
            ← Back
          </button>
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default Step2;