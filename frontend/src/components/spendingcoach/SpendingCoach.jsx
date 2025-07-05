import React, { useState, useEffect } from "react";
import AIAvatar from "../SpendingCoach/AIAvatar";
import MoodSelector from "./MoodSelector";
import ExpenseBarChart from "./ExpenseBarChart";
import NudgeCards from "./NudgeCards";
import WeeklyReport from "./WeeklyReport";
import SavingsNudger from "./SavingsNudger";
import FeedbackButtons from "./FeedbackButtons";
import { useGPayUser } from "../../context/GPayUserContext";

const SpendingCoach = () => {
  const [mood, setMood] = useState("😐");
  const [aiTip, setAiTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [expense7Day, setExpense7Day] = useState([]);
  const goal = "reduce food expenses by 20%";
  const daysActive = 5;
  const weeklySavings = 1500;

  const { transactions = [] } = useGPayUser();

  useEffect(() => {
    const now = new Date();
    const last7 = Array(7).fill(0).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
      const total = transactions
        .filter(
          (t) =>
            t.date &&
            new Date(t.date).toDateString() === d.toDateString() &&
            t.amount < 0
        )
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
      return { day: dayStr, amount: total };
    });
    setExpense7Day(last7);
  }, [transactions]);

  const spendingCategories = transactions.reduce((acc, txn) => {
    if (txn.amount < 0) {
      const cat = txn.category || "other";
      acc[cat] = (acc[cat] || 0) + Math.abs(Number(txn.amount));
    }
    return acc;
  }, {});

  const fetchAITip = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/spending-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          goal,
          daysActive,
          weeklySavings,
          spendingCategories,
        }),
      });
      const data = await res.json();
      setAiTip(data.message || "No advice available.");
    } catch {
      setAiTip("Could not fetch advice.");
    }
    setLoading(false);
  };

  const truncatedTip =
    aiTip.length > 200 ? aiTip.slice(0, 200) + "..." : aiTip;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0f1c] text-white overflow-hidden px-2 py-12">
      <div className="relative z-10 w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          AI Spending Coach
        </h1>
        <p className="text-white/80 mb-6 max-w-xl text-center">
          Your friendly, motivational financial buddy! Get personalized, actionable tips and nudges based on your real spending habits.
        </p>

        <AIAvatar tip={truncatedTip} loading={loading} mood={mood} />

        <MoodSelector mood={mood} setMood={setMood} />

        <button
          onClick={fetchAITip}
          className="mb-4 px-5 py-2 rounded-full bg-white text-[#0a0f1c] font-bold shadow transition hover:bg-gray-200"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Regenerate Tip"}
        </button>

        {expense7Day.some((d) => d.amount > 0) ? (
          <ExpenseBarChart data={expense7Day} />
        ) : (
          <div className="my-8 text-cyan-200">
            No expenses found for the last 7 days.
          </div>
        )}

        <NudgeCards transactions={transactions} />

        <WeeklyReport transactions={transactions} />

        <SavingsNudger goal={goal} weeklySavings={weeklySavings} />

        <FeedbackButtons />
      </div>
    </div>
  );
};

export default SpendingCoach;
