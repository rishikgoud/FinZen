import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import SpendingCoach from "../components/dashboard/SpendingCoach";

const SpendingCoachPage = () => (
  <DashboardLayout>
    <div className="w-full px-2 sm:px-4 py-8 mx-auto">
      <SpendingCoach />
    </div>
  </DashboardLayout>
);

export default SpendingCoachPage; 