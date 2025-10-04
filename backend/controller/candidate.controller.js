import { Candidate } from "../model/candidate.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { client_needs } from "../model/client_needs.model.js";
import { skills } from "../model/skills.model.js";
import { careFacility } from "../model/care_facility.model.js";
import { job_title } from "../model/job_title.model.js";

const candidateRegister = async(req, res) => {
 try {
    const {
        candidateId,
        candidate_name,
        post_code,
        address_line_1,
        address_line_2,
        landline_no,
        jobTitle,
        place,
        mobile_number,
        email_id,
        candidate_dob,
        passport,
        is_visa_for_uk,
        experience,
        countryCode,
        skills,
        careFacility,
        clientNeeds,
        reason_for_leave,
        current_position,
        current_company_name,
        emergency_shift,
        current_salary,
        desired_salary,
        notice_period,
        media_name,
        other_passport,
        advert_ref,
        driver_car_owner,
        dbs,
        dbs_workforce_type,
        w_u_consider
    } = req.body

    console.log('Request body', req.body);

    if(!candidate_name || !post_code || !address_line_1 || !place || !email_id || !candidate_dob || !passport || !experience || !countryCode || !skills) {
        throw new ApiError(400, "All the fields are required");
    }

    let cvFile = req.files?.upload_cv ? req.files.upload_cv[0].filename : null;
    let profileImg = req.files?.profile_img ? req.files.profile_img[0].filename : null;

     
      const existingEmail = await Candidate.findOne({
        where: { email_id },
      });
      if (existingEmail) {
        throw new ApiError(409, "Email already registered");
      }

    if (!candidateId) {
        const newCandidate = await Candidate.create({
        candidateId,
        candidate_name,
        post_code,
        status: "0",
        address_line_1,
        address_line_2,
        landline_no,
        place,
        job_title: Array.isArray(jobTitle) ? jobTitle.join(',') : jobTitle,
        care_facility: Array.isArray(careFacility) ? careFacility.join(',') : careFacility,
        client_need: Array.isArray(clientNeeds) ? clientNeeds.join(',') : clientNeeds,
        mobile_number,
        email_id,
        candidate_dob,
        passport,
        other_passport,
        is_visa_for_uk,
        experience,
        countryCode,
        reason_for_leave,
        current_position,
        current_company_name,
        emergency_shift,
        current_salary,
        desired_salary,
        notice_period,
        driver_car_owner,
        w_u_consider,
        dbs,
        dbs_workforce_type,
        skills: Array.isArray(skills) ? skills.join(',') : skills,
        created_by: candidate_name,
        upload_cv: cvFile,
        profile_img: profileImg,
        media_name,
        advert_ref,
        created_on: new Date(),
        updated_on: new Date(),
        updated_by: candidate_name,
        is_deleted: "",
      });

      // console.log('candidate register',newCandidate);

      return res
        .status(201)
        .json(new ApiResponse(201, newCandidate, "Successfully Candaidate Registered"));
    }
 } catch (error) {
     console.log(`this error comes from candidate registration ${error}`);
     return res.status(400).json(new ApiResponse(400,error,`${error.message}`))
    // throw new ApiError(500, error.message);
  }
}

const getAllInfoCandidate = async (req, res) => {
  try {
    // Step 1: Fetch all candidates
    const candidates = await Candidate.findAll({
      attributes: [
        "candidate_id",
        "candidate_name",
        "post_code",
        "address_line_1",
        "job_title",
        "skills",
        "care_facility",
        "client_need",
        "form_status"
      ],
    });

    if (!candidates.length) {
      throw new ApiError(404, "No candidate info found");
    }

    // Step 2: Fetch all reference tables once
    const [jobTitles, skillsList, facilities, needs] = await Promise.all([
      job_title.findAll({ attributes: ["id", "name"] }),
      skills.findAll({ attributes: ["id", "name"] }),
      careFacility.findAll({ attributes: ["id", "facility_name"] }),
      client_needs.findAll({ attributes: ["id", "name"] }),
    ]);

    // Convert to maps for fast lookup
    const jobTitleMap = Object.fromEntries(jobTitles.map(j => [j.id, j.name]));
    const skillMap = Object.fromEntries(skillsList.map(s => [s.id, s.name]));
    const facilityMap = Object.fromEntries(facilities.map(f => [f.id, f.facility_name]));
    const needMap = Object.fromEntries(needs.map(n => [n.id, n.name]));

    const result = candidates.map(c => ({
      candidate_id: c.candidate_id,
      candidate_name: c.candidate_name,
      post_code: c.post_code,
      address_line_1: c.address_line_1,
      // job_title: c.job_title,
      // skills: c.skills,
      // care_facility: c.care_facility,
      // client_need: c.client_need,
      form_status: c.form_status,

      job_titles: c.job_title
        ? c.job_title.split(",").map(id => jobTitleMap[id.trim()] || null)
        : [],

      skills: c.skills
        ? c.skills.split(",").map(id => skillMap[id.trim()] || null)
        : [],

      facilities: c.care_facility
        ? c.care_facility.split(",").map(id => facilityMap[id.trim()] || null)
        : [],

      client_needs: c.client_need
        ? c.client_need.split(",").map(id => needMap[id.trim()] || null)
        : [],
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, result, "All candidate info Fetched Successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error.message, error, error.stack));
  }
};

const formAction = async(req, res) => {
  const { id } = req.query;
  const { form_status } = req.body;

  console.log("req.body",req.body,req.query)

  try {

    const candidate = await Candidate.findOne({ where: { candidate_id: id } });

    if (!candidate) {
      return res
        .status(404)
        .json(new ApiError(404, "Candidate not found"));
    }


    if (
      candidate.form_status === "APPROVED" ||
      candidate.form_status === "REJECTED"
    ) {
      return res
        .status(400)
        .json(new ApiError(400, {},`Status is already ${candidate.form_status} ,cannot be changed`));
    }
   
    if(form_status === 'APPROVED' || form_status === 'REJECTED') {
      const result = await Candidate.update({ form_status }, {
        where: {
          candidate_id: id
        }
      });
      return res
        .status(200)
        .json(new ApiResponse(200, result, "Status is changed Successfully"));
    }

  } catch (error) {
      return res
      .status(500)
      .json(new ApiError(500, error.message, error, error.stack));
  }
}

export {
    candidateRegister,
    getAllInfoCandidate,
    formAction
}