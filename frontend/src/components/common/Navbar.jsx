import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaBookOpen,
  FaBell,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaMoon,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = ({ minimal = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleProtectedClick = (route) => {
    if (!isAuthenticated) {
      navigate("/register");
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const navLink = (Icon, label, route) => (
    <button
      onClick={() => handleProtectedClick(route)}
      className="group flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold text-white/90 hover:bg-gradient-to-r hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 hover:text-white"
    >
      <Icon className="text-xl group-hover:scale-110 transition-transform" />
      <span className="hidden sm:inline-block">{label}</span>
    </button>
  );

  if (minimal) {
    // Minimal topbar for dashboard pages
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1c]/80 backdrop-blur-lg border-b border-white/10 shadow-md flex items-center justify-end px-6 py-3">
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition"
            >
              <FaUser className="text-xl" />
              <span className="hidden sm:inline-block">Profile</span>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 bg-white text-[#0a0f1c] rounded-lg shadow-lg w-40 z-10 overflow-hidden">
                <button
                  onClick={() => alert("Dark mode toggle placeholder")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaMoon /> Dark Mode
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    window.dispatchEvent(new Event('openOnboarding'));
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaUserPlus /> Complete Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-[#0a0f1c]/80 border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text drop-shadow-lg">
          FinZen
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-2 items-center">
          {navLink(FaTachometerAlt, "Dashboard", "/dashboard")}
          {navLink(FaBookOpen, "Resources", "/resources")}
          {navLink(FaBell, "Notifications", "/notifications")}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition"
              >
                <FaUser className="text-xl" />
                <span className="hidden sm:inline-block">Profile</span>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 bg-white text-[#0a0f1c] rounded-lg shadow-lg w-40 z-10 overflow-hidden">
                  <button
                    onClick={() => alert("Dark mode toggle placeholder")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FaMoon /> Dark Mode
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      window.dispatchEvent(new Event('openOnboarding'));
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FaUserPlus /> Complete Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition"
              >
                <FaSignInAlt /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1db954] to-[#1e90ff] rounded-lg text-white font-semibold hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 transition"
              >
                <FaUserPlus /> Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0f1c]/95 text-white px-6 py-4 space-y-3 rounded-b-xl shadow-lg">
          {navLink(FaTachometerAlt, "Dashboard", "/dashboard")}
          {navLink(FaBookOpen, "Resources", "/resources")}
          {navLink(FaBell, "Notifications", "/notifications")}

          {isAuthenticated ? (
            <>
              <button
                onClick={() => alert("Dark mode toggle placeholder")}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <FaMoon /> Dark Mode
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  window.dispatchEvent(new Event('openOnboarding'));
                }}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <FaUserPlus /> Complete Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20"
              >
                <FaSignInAlt /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-semibold hover:from-[#1db954]/80 hover:to-[#1e90ff]/80"
              >
                <FaUserPlus /> Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
