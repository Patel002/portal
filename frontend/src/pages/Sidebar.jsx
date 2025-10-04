import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "../css/Sidebar.scss";

const SidebarMenu = ({ menuStructure, role }) => {
  const location = useLocation();
 const [openMenuId, setOpenMenuId] = useState(null);

  // Toggle open/close
  const toggleCollapse = (menuId) => {
  setOpenMenuId((prev) => (prev === menuId ? null : menuId));
};

 useEffect(() => {
    if (openMenuId) return; // <-- prevents forcing reopen if user closed it

    const findActiveParent = (menus) => {
      for (let menu of menus) {
        if (menu.submenus && menu.submenus.length > 0) {
          if (menu.submenus.some((sub) => location.pathname === sub.url)) {
            return menu.id;
          }
          const nested = findActiveParent(menu.submenus);
          if (nested) return menu.id;
        }
      }
      return null;
    };

    const activeParent = findActiveParent(menuStructure);
    if (activeParent) {
      setOpenMenuId(activeParent);
    }
  }, [menuStructure, location.pathname, openMenuId]); 

  const renderMenuItems = (menus) =>
    menus.map((menu) => {
      if (!menu) return null;
      const hasSubmenu = menu.submenus && menu.submenus.length > 0;
      const isOpen = hasSubmenu && openMenuId === menu.id;

      return (
        <li
          key={menu.id}
          className={`nav-item ${hasSubmenu ? "has-treeview" : ""} ${
            isOpen ? "menu-open" : ""
          }`}
        >
          {hasSubmenu ? (
            <>
              <a
                href="#"
                className={`nav-link ${isOpen ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleCollapse(menu.id); // user toggling
                }}
              >
                <i
                  className={`nav-icon ${
                    menu.icon || "fa-solid fa-bullseye"
                  }`}
                ></i>
                <p>{menu.menu_name}</p>
              </a>
              <ul
                className="nav nav-treeview"
                style={{
                  display: isOpen ? "block" : "none",
                  marginLeft: "39px",
                }}
              >
                {menu.submenus.map((sub) => (
                  <li key={sub.id} className="nav-item">
                    <Link
                      to={sub.url || "#"}
                      className={`nav-link ${
                        location.pathname === sub.url ? "active" : ""
                      }`}
                    >
                      <i
                        className={`nav-icon ${
                          sub.icon || "fa-solid fa-angle-right"
                        }`}
                      ></i>
                      <p>{sub.menu_name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Link
              to={menu.url || "#"}
              className={`nav-link ${
                location.pathname === menu.url ? "active" : ""
              }`}
            >
              <i className={`nav-icon ${menu.icon}`}></i>
              <p>{menu.menu_name}</p>
            </Link>
          )}
        </li>
      );
    });

  return (
    <nav className="mt-2 adminlte-sidebar">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
        {/* Dashboard */}
        <li className="nav-item ml-0.85">
          <Link
            to="/dashboard"
            className={`nav-link ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            <i className="nav-icon fas fa-tachometer-alt ml-2"></i>
            <p className="ml-2">Dashboard</p>
          </Link>
        </li>

        {/* Dynamic Menu */}
        {menuStructure.length > 0 && renderMenuItems(menuStructure)}

        {/* Logout */}
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-danger"
            onClick={() => {
              sessionStorage.clear();
              window.location.href = "/login";
            }}
          >
            <i className="nav-icon fas fa-sign-out-alt ml-2"></i>
            <p>Logout</p>
          </a>
        </li>
      </ul>
    </nav>
  );
};


SidebarMenu.propTypes = {
  menuStructure: PropTypes.array.isRequired,
  role: PropTypes.string.isRequired,
};

export default SidebarMenu;
