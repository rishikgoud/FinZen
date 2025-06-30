import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import MicroInvestorGuide from "../components/dashboard/MicroInvestorGuide";

const MicroInvestorGuidePage = () => (
  <DashboardLayout>
    <div className="max-w-2xl mx-auto py-8">
      <MicroInvestorGuide />
    </div>
  </DashboardLayout>
);

export default MicroInvestorGuidePage; 