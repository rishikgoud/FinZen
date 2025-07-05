import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const staticNudges = [
  { text: "Skip 2 coffee outings = ₹360 saved", icon: "☕" },
  { text: "Pause unused OTT subscription?", icon: "📺" },
  { text: "Try a no‑spend day challenge!", icon: "🚫💸" },
];

const NudgeCards = ({ transactions = [] }) => {
  const [cards, setCards] = useState(staticNudges);

  useEffect(() => {
    if (transactions.length) {
      const hasFood = transactions.some((t) =>
        t.category?.toLowerCase().includes("food")
      );
      const dynamicFood = hasFood
        ? [{ text: "Try home‑cooked meals to cut food expenses!", icon: "🍲" }]
        : [];
      setCards([...dynamicFood, ...staticNudges]);
    }
  }, [transactions]);

  const handleSwipe = (idx) =>
    setCards((c) => c.filter((_, i) => i !== idx));

  return (
    <div className="w-full max-w-md flex flex-col gap-4 mb-8">
      <AnimatePresence>
        {cards.map((nudge, idx) => (
          <motion.div
            key={nudge.text}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) =>
              Math.abs(info.offset.x) > 120 && handleSwipe(idx)
            }
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ duration: 0.4 }}
            className="bg-[#181f36] border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 cursor-grab select-none"
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-2xl">{nudge.icon}</span>
            <span className="text-white font-semibold">{nudge.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NudgeCards;
