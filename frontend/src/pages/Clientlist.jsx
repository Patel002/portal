import { useState, useEffect, useRef } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net-bs5";

const Clientlist = () => {

    const successAudio = new Audio('/src/assets/success.mp3');
    successAudio.load();

  const Api_base_Url = import.meta.env.VITE_API_BASE;

  const [client, setCandidate] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${Api_base_Url}/client/get-client-info`);
      setCandidate(response.data.data); 
      setFilteredCandidates(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = client.filter((c) =>
      c.candidate_name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCandidates(filtered);
  };

  useEffect(() => {
       

         if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

     if (client.length > 0) {
            $(tableRef.current).DataTable();
        }
        
    }, [client]);



  return (
    <div className="content-wrapper p-3">
  <div className="content">
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-8">
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
          <table ref={tableRef}  id="clientTable" className="table table-striped">
            <thead>
              <tr>
                <th>organisation</th>
                <th>PostCode</th>
                <th>Address</th>
                <th>Contact Name</th>
                <th>Contact Number</th>
                {/* <th>Email</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((client) => (
                <tr key={client.id}>
                  <td>{client.client_organisation}</td>
                  <td>{client.post_code}</td>
                  <td>{client.register_address}</td>
                  <td>{client.main_fullName}</td>
                  <td>{client.mobile_number}</td>
                  {/* <td>{client.main_email}</td> */}
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
                            onClick={() => handleAction(client.candidate_id, "APPROVED")}>
                                <i className="fas fa-check text-success me-2"></i> Approve
                            </button>
                            </li>
                            <li>
                            <button className="dropdown-item"
                            onClick={() => handleAction(client.candidate_id, "REJECTED")}
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

export default Clientlist;
