import React,{ useState, useEffect } from "react";
import axios from "axios";
// import '../css/RolePermission.css';
import showToast from '../helper/toast.js';

const RolePermission = () => {

    const Api_base_Url = import.meta.env.VITE_API_BASE;

    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(sessionStorage.getItem("selectedRole") || "");
    const [parentFilter, setParentFilter] = useState(sessionStorage.getItem("parentFilter") || "All");
    const [menuPermissions, setMenuPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState({});

    useEffect(() => {
        fetchRoles();
        fetchMenuPermissions();
    }, []);
    
    useEffect(() => {
        if (selectedRole) {
            fetchRolePermissions(selectedRole);
        } else {
            setRolePermissions({});
        }

        const interval = setInterval(() => {
            if (selectedRole) {
                fetchRolePermissions(selectedRole);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [selectedRole]);

    useEffect(() => {
        sessionStorage.setItem("selectedRole", selectedRole);
    }, [selectedRole]);

    useEffect(() => {
        sessionStorage.setItem("parentFilter", parentFilter);
    }, [parentFilter]);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${Api_base_Url}/role/list-role`);
            setRoles(response.data.roles);
        } catch (error) {
            console.log(error);
            showToast("error", "Failed to fetch roles");
        }
    }

    const fetchRolePermissions = async (roleId) => {
        try {
            const response = await axios.get(`${Api_base_Url}/access/list-permission?roleId=${roleId}`);
            const permissionsData = response.data.permission || [];
            const permissionMap = {};
            
            console.log("permission map" ,permissionMap)
            permissionsData.forEach((perm) => {
                const permissionKey = `menu_${perm.menu_id}`;
                
                permissionMap[permissionKey] = {
                    readp: perm.readp === 1,
                    writep: perm.writep === 1,
                    updatep: perm.updatep === 1,
                    deletep: perm.deletep === 1,
                    startTime: perm.start_time || "",
                    endTime: perm.end_time || "",
                    menu_id: perm.menu_id,
                };
            });

            setRolePermissions(permissionMap);
        } catch (error) {
            console.error("Error fetching role permissions:", error);
            showToast("error", "Failed to fetch role permissions");
        }
    }

    const fetchMenuPermissions = async () => {
        try {
            const response = await axios.get(`${Api_base_Url}/access/all-menu-permissions`);
            const menuData = response.data.data || [];
    
            const structuredMenus = menuData.map(menu => ({
                id: menu.id,
                menuName: menu.menuName,
                parentName: menu.parentName  || null,
                url: menu.url,
                icon: menu.icon,
                active: menu.active,
                permissions: menu.permissions || []
                }));
            console.log("Menu Permissions:", structuredMenus);

            setMenuPermissions(structuredMenus);
        } catch (error) {
            console.error("Error fetching menu permissions:", error);
            showToast("error", "Failed to fetch menu permissions");
        }
    };
    
    const handlePermissionChange = (key, permissionType) => {
        setRolePermissions((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [permissionType]: !prev[key]?.[permissionType],
            },
        }));
    };

    const handleTimeChange = (key, timeType, value) => {
        setRolePermissions((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [timeType]: value,
            },
        }));
    };



    const handleSavePermissions = async () => {
        if (!selectedRole) {
            showToast("error", "Please select a role first");
            return;
        }
    
        try {
            const permissionsToSave = [];
            
            menuPermissions.forEach(menu => {
                const menuKey = `menu_${menu.id}`;
                if (rolePermissions[menuKey]) {
                    permissionsToSave.push({
                    role_id: selectedRole,
                    menu_id: menu.id,
                    readp: rolePermissions[menuKey].readp ? 1 : 0,
                    writep: rolePermissions[menuKey].writep ? 1 : 0,
                    updatep: rolePermissions[menuKey].updatep ? 1 : 0,
                    deletep: rolePermissions[menuKey].deletep ? 1 : 0,
                    start_time: rolePermissions[menuKey].startTime || null,
                    end_time: rolePermissions[menuKey].endTime || null
                    });
                }
            });
    
            console.log("Saving permissions:", permissionsToSave);

            const results = await Promise.allSettled(
                permissionsToSave.map(perm => 
                    axios.post(`${Api_base_Url}/access/add-permission`, perm)
                )
            );
    
            const failedSaves = results.filter(r => r.status === 'rejected');
            if (failedSaves.length > 0) {
                console.error("Failed to save some permissions:", failedSaves);
                throw new Error(`${failedSaves.length} permissions failed to save`);
            }
    
            showToast("success", "Permissions updated successfully!");
            window.dispatchEvent(new Event("permissionsUpdated"));

             setTimeout(() => {
            window.location.reload();
        }, 3000); 
        
        } catch (error) {
            console.error("Error saving permissions:", error);
            showToast("error", error.message || "Failed to update permissions");
        }
    };


    const handleRoleChange = (e) => {
        const roleId = e.target.value;
        setSelectedRole(roleId);
    };

    const getPermissionKey = (item) => {
        return `menu_${item.id}`;
    };

    const getParentFilterOptions = () => {
        const parents = new Set(["All"]);

        console.log("parent names", parents)
        
        menuPermissions.forEach(menu => {
            if (menu.parent_id) {
                parents.add(menu.parentName);
            } else {
                parents.add(menu.menuName);
            }
        });

        console.log("parent return values", Array.from(parents))
        
        return Array.from(parents);
    };

    const handleGlobalPermissionToggle = (permissionType, isChecked) => {
        const updatedPermissions = { ...rolePermissions };

        menuPermissions.forEach((menu) => {
            const menuKey = getPermissionKey(menu);
            updatedPermissions[menuKey] = {
              ...updatedPermissions[menuKey],
              [permissionType]: isChecked
            };
          });

  setRolePermissions(updatedPermissions);
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
                                <li className="breadcrumb-item"><a href="/dashboard"><i className="fa-solid fa-house"/></a></li>
                                <li className="breadcrumb-item active">Role Permission</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header bg-white text-black">
                                    <h5> <i class="fa-solid fa-list-ul"></i> Role List</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>User Role*</label>
                                            <select 
                                                className="form-control" 
                                                value={selectedRole} 
                                                onChange={handleRoleChange} 
                                                required
                                            >
                                                <option value="">Select</option>
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.rolename}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label>Parent Name</label>
                                            <select 
                                                className="form-control" 
                                                value={parentFilter} 
                                                onChange={(e) => setParentFilter(e.target.value)}
                                            >
                                                {getParentFilterOptions().map((parent, index) => (
                                                    <option key={index} value={parent}>
                                                        {parent}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                           
            <div className="row mt-4">
            <div className="col-md-12">
            <table className="table table-white table-bordered">
            <thead>
                        <tr>
                        <th>Parent Name</th>
                        <th>Menu</th>
                        <th>
                        <input
                        type="checkbox"
                        onChange={(e) => handleGlobalPermissionToggle("readp", e.target.checked)}
                        />&nbsp; Read
                        </th>

                        <th>
                        <input
                        type="checkbox"
                        onChange={(e) => handleGlobalPermissionToggle("writep", e.target.checked)}
                        /> &nbsp; Write
                        </th>

                        <th>
                        <input
                        type="checkbox"
                        onChange={(e) => handleGlobalPermissionToggle("updatep", e.target.checked)}
                        /> &nbsp; 
                        Update
                        </th>   

                        <th>
                        <input
                        type="checkbox"
                        onChange={(e) => handleGlobalPermissionToggle("deletep", e.target.checked)}
                        />&nbsp; 
                        Delete
                        </th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        </tr>
            </thead>
            <tbody>
            {menuPermissions
            .filter((menu) => {
            if (parentFilter === "All") return true;
            if (menu.menuName === parentFilter) return true;
            return menu.parentName === parentFilter;
            })
            .sort((a, b) => {
            if (!a.parentName && b.parentName) return -1;
            if (a.parentName && !b.parentName) return 1;
            return (a.menuName || "").localeCompare(b.menuName || "");
            })
            .map((menu) => {
            const menuKey = getPermissionKey(menu);
            const menuPerms = rolePermissions[menuKey] || {};

            return (
            <React.Fragment key={menu.id}>
                <tr className="parent-menu">
                <td>{menu.parentName || ""}</td>
                <td>{menu.menuName}</td>
                <td>
                    <input 
                    type="checkbox" 
                    checked={menuPerms.readp || false} 
                    onChange={() => handlePermissionChange(menuKey, "readp")} 
                    />
  </td>
        <td>
        <input 
        type="checkbox" 
        checked={menuPerms.writep || false} 
        onChange={() => handlePermissionChange(menuKey, "writep")} 
            />
        </td>
        <td>
        <input 
        type="checkbox" 
        checked={menuPerms.updatep || false} 
        onChange={() => handlePermissionChange(menuKey, "updatep")} 
    />
    </td>
    <td>
        <input 
            type="checkbox" 
            checked={menuPerms.deletep || false} 
            onChange={() => handlePermissionChange(menuKey, "deletep")} 
        />
    </td>
    <td>
        <input 
            type="time" 
            className="form-control" 
            value={menuPerms.startTime || ""} 
            onChange={(e) => handleTimeChange(menuKey, "startTime", e.target.value)} 
        />
    </td>
    <td>
        <input 
            type="time" 
            className="form-control" 
            value={menuPerms.endTime || ""} 
            onChange={(e) => handleTimeChange(menuKey, "endTime", e.target.value)} 
        />
    </td>
</tr>
            
    </React.Fragment>
);
})}
        </tbody>
    </table>
            </div>
        </div>
        <div className="text-right mt-3">
            <button 
                className="btn btn-primary" 
                onClick={handleSavePermissions}
                disabled={!selectedRole}
            >
                <i className="fa fa-check mr-2"></i>
                Set Permissions
             </button>
            </div>
           </div>
          </div>
         </div>
        </div>
      </div>
    </section>
   </div>
);
};

export default RolePermission;