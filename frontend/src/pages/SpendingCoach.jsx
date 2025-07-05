import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import SpendingCoach from "../components/spendingcoach/SpendingCoach";
import BubbleBackground from "./BubbleBackground";

const SpendingCoachPage = () => (
  <DashboardLayout>
    <div className="w-full flex justify-center pt-24 sm:px-4">
      <BubbleBackground />
      <SpendingCoach />
    </div>
  </DashboardLayout>
);

export default SpendingCoachPage;
