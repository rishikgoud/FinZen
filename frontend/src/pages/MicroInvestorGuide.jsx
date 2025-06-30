import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import MicroInvestorGuide from "../components/dashboard/MicroInvestorGuide";

const MicroInvestorGuidePage = () => (
  <DashboardLayout>
    <div className="w-full px-2 sm:px-4 py-8">
      <MicroInvestorGuide />
    </div>
  </DashboardLayout>
);

export default MicroInvestorGuidePage; 