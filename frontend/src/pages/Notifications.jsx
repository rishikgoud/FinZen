import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";

const Notifications = () => (
  <DashboardLayout>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">Notifications</h2>
      <div className="text-white/60">No notifications yet.</div>
    </motion.div>
  </DashboardLayout>
);

export default Notifications; 