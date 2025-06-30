import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import LoanEligibilityDesk from "../components/dashboard/LoanEligibilityDesk";

const LoanEligibilityPage = () => (
  <DashboardLayout>
    <div className="max-w-2xl mx-auto py-8">
      <LoanEligibilityDesk />
    </div>
  </DashboardLayout>
);

export default LoanEligibilityPage; 