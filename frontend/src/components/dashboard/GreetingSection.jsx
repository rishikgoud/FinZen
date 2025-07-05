import React from "react";
import { useGPayUser } from "../../context/GPayUserContext";
import { useAuth } from "../../context/AuthContext";

const GreetingSection = () => {
  const { gpayUser } = useGPayUser();
  const { user } = useAuth();
  const hour = new Date().getHours();
  let greeting = "Welcome";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  return (
    <div className="text-center mt-10 mb-10 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
          Hi {gpayUser?.name || user?.profile?.firstName || user?.firstName || "User"}, {greeting} 👋
        </h1>
      </div>
      <p className="text-white/60 mt-2 text-sm md:text-base">
        Balance: ₹{gpayUser?.balance?.toLocaleString() ?? "—"}
      </p>
    </div>
  );
};

export default GreetingSection;
