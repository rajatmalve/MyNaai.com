import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

// Icons definitions (SVG)
const Icons = {
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Scissors: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  )
};

const navItems = [
  { path: "/", label: "User Management", icon: <Icons.Users /> },
  { path: "/salons", label: "Salon Management", icon: <Icons.Scissors /> },
  { path: "/bookings", label: "Booking Management", icon: <Icons.Calendar /> },
];

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setOpen(false);
    navigate("/login");
  };

  return (
    <div className="app-shell d-flex">
      {/* Desktop Sidebar */}
      <aside className="sidebar d-none d-md-flex flex-column p-3 gap-3 position-sticky top-0 vh-100">
        <Link to="/" className="d-flex align-items-center gap-2 text-white fw-semibold fs-5 mb-2 text-decoration-none">
          <Icons.Scissors /> Salon Admin
        </Link>
        <nav className="nav flex-column gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
          <button className="btn btn-logout btn-sm w-100 mt-3 d-flex align-items-center justify-content-center" onClick={handleLogout}>
            <Icons.Logout /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile + Desktop Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Mobile Topbar */}
        <div className="d-md-none">
          <header className="navbar bg-white shadow-sm sticky-top px-2 mobile-header-fixed">
            <div className="d-flex align-items-center justify-content-between w-100">

              {/* Left: Menu + Brand */}
              <div className="d-flex align-items-center gap-2 min-w-0 flex-grow-1">
                <button
                  className="navbar-toggler p-1 border-0"
                  type="button"
                  aria-label="Toggle navigation"
                  onClick={() => setOpen(!open)}
                  style={{ fontSize: '1.2rem' }}
                >
                  <span className="navbar-toggler-icon" />
                </button>

                <Link
                  to="/"
                  className="navbar-brand fw-semibold text-truncate m-0 d-flex align-items-center gap-2"
                  style={{ maxWidth: "150px", fontSize: '1rem' }}
                  onClick={() => setOpen(false)}
                >
                  <Icons.Scissors /> Salon
                </Link>
              </div>

              {/* Right: Logout */}
              <button
                className="btn btn-outline-secondary btn-sm flex-shrink-0 d-flex align-items-center"
                onClick={handleLogout}
                style={{ fontSize: '0.85rem' }}
              >
                <Icons.Logout />
                <span className="d-none d-sm-inline">Logout</span>
              </button>

            </div>
          </header>

          {/* Mobile Dropdown Menu */}
          {open && (
            <div className="bg-white shadow-sm border-bottom d-md-none dropdown-menu page-dropdown dropdown-menu show w-100 position-absolute">
              <nav className="nav flex-column p-3 gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center gap-2 ${isActive ? "active fw-semibold" : ""}`
                    }
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <main className="flex-grow-1">
          <div className="container-fluid">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;