import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaTachometerAlt, FaExchangeAlt, FaChartPie, FaCog, FaRobot, FaPiggyBank, FaUniversity } from "react-icons/fa";
import { fetchUserProfile } from "../../utils/api";
import Avatar1 from "../../assets/avatars/Avatar1.svg";

const navItems = [
  { label: "Dashboard", icon: <FaTachometerAlt />, href: "/dashboard" },
  { label: "Spending Coach", icon: <FaRobot />, href: "/dashboard/spending-coach" },
  { label: "Micro Investor", icon: <FaPiggyBank />, href: "/dashboard/micro-investor" },
  { label: "Loan Eligibility", icon: <FaUniversity />, href: "/dashboard/loan-eligibility" },
  { label: "Settings", icon: <FaCog />, href: "/dashboard/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const [avatar, setAvatar] = React.useState(Avatar1);
  const [open, setOpen] = useState(false);
  React.useEffect(() => {
    fetchUserProfile().then((profile) => {
      setAvatar(profile?.profile?.avatar || Avatar1);
    });
  }, []);
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#1db954] text-white p-2 rounded-full shadow-lg"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open sidebar"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0a0f1c]/95 backdrop-blur-lg shadow-2xl border-r border-white/10 z-40 flex flex-col items-start py-6 transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:w-56 md:items-start md:block md:static md:h-full md:py-6 md:translate-x-0`}
        style={{ minWidth: 0 }}
      >
        {/* Close button on mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-white bg-[#1db954] p-2 rounded-full"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        {/* Logo (links to home) */}
        <div className="mb-4 w-full flex justify-center md:justify-start px-4">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text" title="Go to Home">
            FinZen
          </Link>
        </div>
        {/* Home Link
        <div className="mb-6 w-full flex justify-center md:justify-start px-4">
          <Link to="/" className="flex items-center gap-2 group" title="Go to Home">
            <FaHome className="text-xl text-[#1db954] group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline-block text-base font-medium bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">Home</span>
          </Link>
        </div> */}
        <nav className="flex flex-col gap-4 w-full px-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all text-base group ${location.pathname === item.href ? "bg-gradient-to-r from-[#1db954]/80 to-[#1e90ff]/80 text-white" : "text-white/80 hover:bg-gradient-to-r hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 hover:text-white"}`}
              title={item.label}
              onClick={() => setOpen(false)}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="hidden md:inline-block">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto w-full flex flex-col items-center md:items-start px-4 pb-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#1db954] bg-white/20 flex items-center justify-center shadow-lg mt-6 overflow-hidden">
            <img src={avatar} alt="avatar" className="w-12 h-12 object-cover" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 