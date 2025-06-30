import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import LoanEligibilityDesk from "../components/dashboard/LoanEligibilityDesk";

const LoanEligibilityPage = () => (
  <DashboardLayout>
    <div className="w-full px-2 sm:px-4 py-8">
      <LoanEligibilityDesk />
    </div>
  </DashboardLayout>
);

export default LoanEligibilityPage; 