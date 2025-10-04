import { useState, useEffect, useRef } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net-bs5";
import showToast from "../helper/toast.js";

const CandidateInfo = () => {

    const successAudio = new Audio('/src/assets/success.mp3');
    successAudio.load();

  const Api_base_Url = import.meta.env.VITE_API_BASE;

  const [candidate, setCandidate] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${Api_base_Url}/candidate/info`);
      setCandidate(response.data.data); 
      setFilteredCandidates(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = candidate.filter((c) =>
      c.candidate_name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCandidates(filtered);
  };

  useEffect(() => {
        if (candidate.length > 0) {
            $(tableRef.current).DataTable();
        }
        
    }, [candidate]);

    const handleAction = async(id, form_status) => {
        try {

            await axios.patch(`${Api_base_Url}/candidate/action?id=${id}`, { form_status });
            fetchCandidates();
            showToast("success", `Status is ${form_status}`);
            successAudio.play();
            
        } catch (error) {
            console.log(error)
            showToast("error", error.response.data.errors);
        }
    }

  return (
    <div className="content-wrapper p-3">
  <div className="content">
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <table ref={tableRef}  id="candidateTable" className="table table-striped">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>PostCode</th>
                <th>Address</th>
                <th>Skill</th>
                <th>Job</th>
                <th>Client Needs</th>
                <th>Care Facility</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.candidate_id}>
                  <td>{candidate.candidate_name}</td>
                  <td>{candidate.post_code}</td>
                  <td>{candidate.address_line_1}</td>
                  <td>{candidate.skills?.join(", ")}</td>
                  <td>{candidate.job_titles?.join(", ")}</td>
                  <td>{candidate.client_needs?.join(", ")}</td>
                  <td>{candidate.facilities?.join(", ")}</td>
                <td>
                    <span
                      className={`badge ${
                        candidate.form_status === "APPROVED"
                          ? "bg-success"
                          : candidate.form_status === "REJECTED"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {candidate.form_status}
                    </span>
                  </td>
                   <td>
                <div className="dropdown">
                        <button
                            className="btn btn-sm btn-light"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fas fa-ellipsis-v"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                            <button className="dropdown-item">
                                <i className="fas fa-edit text-primary me-2"></i> Edit
                            </button>
                            </li>
                            <li>
                            <button className="dropdown-item"
                            onClick={() => handleAction(candidate.candidate_id, "APPROVED")}>
                                <i className="fas fa-check text-success me-2"></i> Approve
                            </button>
                            </li>
                            <li>
                            <button className="dropdown-item"
                            onClick={() => handleAction(candidate.candidate_id, "REJECTED")}
                            >
                                <i className="fas fa-times text-danger me-2"></i> Reject
                            </button>
                            </li>
                        </ul>
                        </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default CandidateInfo;
