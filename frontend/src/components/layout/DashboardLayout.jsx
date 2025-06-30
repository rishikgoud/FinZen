import React from "react";
import Sidebar from "./Sidebar";
import AnimatedBackground from "../ui/AnimatedBackground";

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen bg-[#0a0f1c] flex relative overflow-hidden">
    {/* Animated background for 3D/bubble effect */}
    <AnimatedBackground />
    {/* Sidebar navigation */}
    <Sidebar />
    {/* Main content area */}
    <main className="flex-1 ml-20 md:ml-56 px-4 md:px-10 py-10 relative z-10">
      {children}
    </main>
  </div>
);

export default DashboardLayout; 