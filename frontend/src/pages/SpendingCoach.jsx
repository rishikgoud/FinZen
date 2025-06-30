import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import SpendingCoach from "../components/dashboard/SpendingCoach";

const SpendingCoachPage = () => (
  <DashboardLayout>
    <div className="max-w-2xl mx-auto py-8">
      <SpendingCoach />
    </div>
  </DashboardLayout>
);

export default SpendingCoachPage; 