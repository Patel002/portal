import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RoleSelection = () => {

    const Api_base_Url = import.meta.env.VITE_API_BASE;

    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        sessionStorage.setItem("selectedRole", selectedRole);
        // console.log(typeof selectedRole,  btoa(unescape(encodeURIComponent(selectedRole))));

    }, [selectedRole]);

    const fetchRoles = async () => {
        try {
           const response = await axios.get(`${Api_base_Url}/role/list-role`);
           setRoles(response.data.roles);
           setError('');
        } catch (error) {
        setError(error.response?.data?.message);
        console.log(error);
        }
    }

    const handleSubmit = async () => {
        if(!selectedRole)
        {
            setError("Please select a role");
            return;
        }
        try {
            
            const response = await axios.get(`${Api_base_Url}/access/list-permission?roleId=${selectedRole}`);
           
            sessionStorage.setItem("permission", JSON.stringify(response.data.menu));

            // console.log('permission from role selection',JSON.stringify(response.data.menu));

        } catch (error) {
        setError(error.response?.data?.message);
        console.log(error); 
        }
        navigate(`/permissions?roleId=${btoa(selectedRole)}`);
    }

    return (
        <div className="content-wrapper">
        <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6 mt-5">
                            <h1>User Roles</h1>
                        </div>
                        <div className="col-sm-6 mt-5">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/dashboard">
                                <i className="fa-solid fa-house" />
                                </a></li>
                                <li className="breadcrumb-item active">User Roles</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    <div className="card">
                    <div className="card-header bg-white text-black ">
                    <h5 className="mt-1 mb-1">
                        Role Permission
                    </h5>
                                </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Select Role</label>
                                <select
                                    className="form-control"
                                    value={selectedRole}
                                    required = {true}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.rolename}</option>
                                    ))}
                                </select>
                            </div>

                            <button className="btn btn-primary" onClick={handleSubmit}>
                                Fetch Permissions
                            </button>

                            {error && <p className="text-danger mt-3">{error}</p>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

}

export default RoleSelection;