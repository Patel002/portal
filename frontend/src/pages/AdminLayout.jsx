import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import '../css/AdminLayout.css';
import logo from '/public/assets/logo-filled.png';
import SidebarMenu from './Sidebar';
import axios from "axios";
import 'admin-lte';

const AdminLayout = () => {

    const Api_base_Url = import.meta.env.VITE_API_BASE;

    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [menuStructure, setMenuStructure] = useState([]);
   
    const role = sessionStorage.getItem("role"); 
    // console.log('role',role)
    const roleId = sessionStorage.getItem("roleId");
    // console.log('id',id)

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
        }
      }, []);
      
    
        useEffect(() => {
            const fetchMenu = async () => {
                try {
                    let response;
                    if (role === "SUPER ADMIN") {
                        response = await axios.get(`${Api_base_Url}/access/list?roleId=${roleId}`);
                        
                    } else {
                        response = await axios.get(`${Api_base_Url}/access/list?roleId=${roleId}`);   
                    }

                    const data = response.data.data;
                    console.log("Menu API response:", data);

                    let menuMap = new Map();
                    let menuTree = [];
                    let submenuMap = new Map();
        
            data.forEach(menu => {
                const menuItem = { 
                    ...menu, 
                    submenus: [], 
                    isOpen: false,
                    isSubmenu: !!menu.parent_id 
                };  
                
                if (menuItem.isSubmenu) {
                    submenuMap.set(menu.id, menuItem);
                } else {
                    menuMap.set(menu.id, menuItem);
                }
            });

            data.forEach(menu => {
                if (menu.parent_id) {
                    const parent = menuMap.get(menu.parent_id) || submenuMap.get(menu.parent_id);
                    if (parent) {
                        const child = menuMap.get(menu.id) || submenuMap.get(menu.id);
                        parent.submenus.push(child);
                    }
                } else if (!menu.isSubmenu) {
                    menuTree.push(menuMap.get(menu.id));
                }
            });

            menuTree = menuTree.filter(menu => {
                return menu.submenus.length > 0 || menu.url;
            });

                    console.log("Menu tree:", menuTree);
                    setMenuStructure(menuTree);
                } catch (error) {
                    console.error("Error fetching menu:", error);
                }
            };

            fetchMenu();

            const interval = setInterval(() => {
                fetchMenu();
            },10000);

            return () => clearInterval(interval);
        }, [role]);
        
        useEffect(() => {
            if (window.$ && window.$.fn && window.$.fn.Layout) {
              window.$('[data-widget="pushmenu"]').PushMenu();
              console.log("AdminLTE layout fully available.");
            } else {
              console.error("AdminLTE layout not fully available.");
            }
          }, []);
          
        console.log("LTE",window.$.fn.Layout);

        const toggleCollapse = (event) => {
            event.preventDefault(); 
            setIsCollapsed(prev => !prev);
        };

        const toggleDarkMode = () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
          };
          

    return (
        <div className="wrapper"> 
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
  <ul className="navbar-nav">
    <li className="nav-item">
      <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
    </li>
    <li className="nav-item d-none d-sm-inline-block">
      <Link to="/dashboard" className="nav-link">Home</Link>
    </li>
    {/* <li className="nav-item d-none d-sm-inline-block">
      <a href="#" className="nav-link">Contact</a>
    </li> */}
    {/* <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Help
      </a> */}
      {/* <div className="dropdown-menu" aria-labelledby="navbarDropdown2">
        <a className="dropdown-item" href="#">FAQ</a>
        <a className="dropdown-item" href="#">Support</a>
        <div className="dropdown-divider"></div>
        <a className="dropdown-item" href="#">Contact</a>
      </div> */}
    {/* </li> */}
  </ul>
  <ul className="navbar-nav ml-auto">
    <li className="nav-item">
        <a className="nav-link" data-widget="fullscreen" href="#" role="button">
            <i className="fas fa-expand-arrows-alt"></i>
        </a>
    </li>
    <li className="nav-item dropdown">
    <a className="nav-link" data-toggle="dropdown" href="#">
      <i className="fas fa-user-circle"></i>
    </a>
    <div className="dropdown-menu dropdown-menu-right">
      <Link to="/user-profile" className="dropdown-item">Profile</Link>
    </div>
    </li>
    <li className="nav-item">
  <a href="#" onClick={toggleDarkMode} role="button" className="nav-link">
   <i className="fa-regular fa-moon"></i>
  </a>
</li>
  </ul>
</nav>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <Link to="/dashboard" className="brand-link">
                    <img src ={logo} alt="Admin Logo" className="brand-image img-circle elevation-2" style={{
                         opacity: '0.8',
                         backgroundColor: 'white',
                         borderRadius: '50%',
                         width: '35px',
                         height: '60px'
                          }} 
                          />
                    <span className="font-weight-bold text-decoration-none">Nightingale-Care</span>
                </Link>
                <div className="sidebar">
                {/* <div className="form-inline mt-3">
                        <div className="input-group" data-widget="sidebar-search">
                            <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                            <div className="input-group-append">
                                <button className="btn btn-sidebar">
                                    <i className="fas fa-search fa-fw"></i>
                                    </button>
                                </div>
                        </div>
                    </div> */}

                    <nav className="mt-1">
                        <ul className="nav nav-pills nav-sidebar flex-column " data-widget="treeview" role="menu">
                        {role === "SUPER ADMIN" && (
                            <li className={`nav-item has-treeview ${isCollapsed ? "menu-open" : ""}`}>
                                {/* <p className="nav-header mb-0 font-weight-bold
                                ">Access Control
                                </p> */}
                                <a href="" className="nav-link d-flex align-items-center" onClick={toggleCollapse}>

                                    <i className="nav-icon fa-solid fa-chart-pie "></i>
                                    <p className="ml-2 mb-0">
                                        Admin Master
                                        <i className={`right fas ${isCollapsed ? "fa-angle-down" : "fa-angle-left"}`}></i>
                                    </p>
                                </a>
                                <ul className="nav nav-treeview">

                                    {/* <li className="nav-item">
                                        <Link to="/user" className={`nav-link d-flex align-items-center ${location.pathname === "/user" ? "active" : ""}`}>
                                            <i className="nav-icon fas fa-user-plus"></i>
                                            <p className="ml-2 mb-0">User</p>
                                        </Link>
                                    </li> */}
                                    <li className="nav-item ml-3">
                                        <Link to="/roles" className={`nav-link d-flex align-items-center ${location.pathname === "/roles" ? "active" : ""}`}>
                                            <i className="nav-icon fas fa-users-cog"></i>
                                            <p className="ml-2 mb-0">Roles</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item ml-3">
                                        <Link to="/menu" className={`nav-link d-flex align-items-center ${location.pathname === "/menu" ? "active" : ""}`}>
                                            <i className="nav-icon fas fa-bars"></i>
                                            <p className="ml-2 mb-0">Menu</p>
                                        </Link>
                                    </li>
                                    {/* <li className="nav-item">
                                        <Link to="/submenu" className={`nav-link d-flex align-items-center ${location.pathname === "/submenu" ? "active" : ""}`}>
                                            <i className="nav-icon fas fa-list"></i>
                                            <p className="ml-2 mb-0">Sub Menu</p>
                                        </Link>
                                    </li> */}
                                    <li className="nav-item ml-3">
                                <Link
                                    to="/roleselection"
                                    className={`nav-link d-flex align-items-center ${location.pathname === "/roleselection" ? "active" : ""}`}
                                    style={{
                                    backgroundColor: location.pathname === "/roleselection" ? "#7d4bcbc6" : "transparent",
                                    fontWeight: location.pathname === "/roleselection" ? 700 : "normal",
                                    color: location.pathname === "/roleselection" ? "white" : "",
                                    }}
                                >
                                    <i className="nav-icon fa-solid fa-shield"></i>
                                    <p className="ml-2 mb-0">Role Permission</p>
                                </Link>
                                </li>
                                </ul>
                                <div className="user-panel d-flex align-items-center mt-2">
                                </div>
                            </li>
                         )} 
                            <ul className="nav nav-pills nav-sidebar flex-column">
                    </ul>
                    <div>
                    <SidebarMenu menuStructure={menuStructure} role={role}  />
                    </div>
                </ul>
            </nav>
        </div>
    </aside>
<Outlet />
</div>
    );
};

export default AdminLayout;