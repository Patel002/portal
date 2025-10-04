import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import $ from "jquery";
import "datatables.net-bs5";
import showToast from "../helper/toast.js";

const JobTitle = () => {
    const Api_base_Url = import.meta.env.VITE_API_BASE;
    
  const successAudio = new Audio('/src/assets/success.mp3');
    successAudio.load();

    const [jobTitle, setJobTitle] = useState([]);
    const [titleName, setTitleName] = useState('');
    const [error, setError] = useState('');
    const [editData, setEditData] = useState(null);
    const tableRef = useRef(null);

    const isDark = localStorage.getItem("theme") === "dark";

    useEffect(() => {
        fetchTitle();
    }, [])

    useEffect(() => {
        if (jobTitle.length > 0) {
            $(tableRef.current).DataTable();
        }
    }, [jobTitle]);

    const handleEdit = (data) => {
        setTitleName(data.name);
        setEditData(data);
        setError('');
    }

    const handleDelete = async (id) => {
       Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        background: isDark ? '#333' : '#fff',
        confirmButtonText: 'Yes, delete it!'
       }).then(async (result) => {
        if (result.isConfirmed) {
        try {
            await axios.delete(`${Api_base_Url}/job-title/delete-title?id=${id}`);
            fetchTitle();
            setError('');
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message);
        }
    }
        });
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!titleName) {
            setError("Client facility needs cannot be empty");
            return;
        }
        try {
            const response = await axios.patch(`${Api_base_Url}/job-title/update-title?id=${editData.id}`, { titleName });
            setTitleName('');
            setEditData(null);
            setError('');
            fetchTitle();

            if(response.status === 200) {
                showToast("success", response.data.message);
                successAudio.play();
            }

            console.log(response);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    }

    const fetchTitle = async () => {
        try {
            const res = await axios.get(`${Api_base_Url}/job-title/job-title`);
            setJobTitle(res.data.data);
            setError('');


            console.log("Client needs",res.data.data)

        } catch (error) {
            console.error("Error fetching Needs:", error);
            setError(error.response?.data?.message)

        }
    }

    const handleAddjobTitle = async (e) => {
        e.preventDefault();

        if (!titleName) {
            setError("Care facility name cannot be empty");
            return;
        }

        try {

            const adminId = sessionStorage.getItem('creater');

            const res = await axios.post(`${Api_base_Url}/job-title/add-title`, { titleName, created_by: adminId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (res.status === 200 || res.status === 201) {
                setTitleName('');
                setError('');
                fetchTitle();
                showToast("success", res.data.message);

            } else {
                setError("error while adding care facilities needs");
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "error while adding care facilities needs");
        }
    }

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-15 mt-5">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <a href="/dashboard">
                                        <i className="fa-solid fa-house" />
                                    </a>
                                </li>
                                <li className="breadcrumb-item active">Job Title</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="card">
                                <div className="card-header bg-white text-black">
                                    <h3 className="card-title">
                                        <i className="fa-solid fa-plus mr-2" />
                                        {editData ? "Edit Job Title" : " Add Job Title"}
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={editData ? handleUpdate : handleAddjobTitle}>
                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                value={titleName}
                                                onChange={(e) => setTitleName(e.target.value)}
                                                className="form-control mb-2"
                                                placeholder="Enter Need Name"
                                                required
                                            />
                                            <div className="d-flex gap-2">
                                                <button
                                                    type="submit"
                                                    className={`btn ${editData ? 'btn-warning' : 'btn-primary'} w-25`}
                                                >
                                                    <i className="fa-solid fa-check " /> {editData ? "Update" : "Save"}
                                                </button>
                                                {editData && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary w-25"
                                                        onClick={() => {
                                                            setTitleName('');
                                                            setEditData(null);
                                                            setError('');
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-xmark" /> Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {error && <p className="text-danger mt-2">{error}</p>}
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="card">
                                <div className="card-header bg-white text-black">
                                    <h3 className="card-title">
                                        <i className="fa-solid fa-list-check mr-2" />
                                        Job Title List
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <table ref={tableRef} className="table table-striped table-bordered">
                                        <thead className="bg-secondary text-white">
                                            <tr>
                                                <th>Sr.</th>
                                                <th>Job Title Name</th>
                                                <th style={{ width: "25%" }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobTitle.map((c, index) => (
                                                <tr key={c.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{c.name}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleEdit(c)}
                                                            className="btn btn-primary btn-sm mx-1"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square" />
                                                        </button>

                                                        <button onClick={() => handleDelete(c.id)} className="btn btn-danger btn-sm">
                                                        <i className="fa fa-trash"></i>
                                                    </button>
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
            </section>
        </div>
    );
};

export default JobTitle;