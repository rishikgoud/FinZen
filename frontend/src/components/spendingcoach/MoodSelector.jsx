import React from "react";
import { motion } from "framer-motion";

const MOODS = ["😄", "😐", "😬", "😢"];

const MoodSelector = ({ mood, setMood }) => (
  <div className="flex gap-4 items-center my-8">
    <span className="text-cyan-200 font-semibold">How are you feeling?</span>
    {MOODS.map((m) => (
      <motion.button
        key={m}
        onClick={() => setMood(m)}
        whileTap={{ scale: 0.9 }}
        className={`text-3xl p-2 rounded-full border-2 ${
          mood === m ? "border-cyan-400 bg-cyan-900" : "border-transparent bg-[#1a2a4f]"
        } hover:bg-cyan-800 transition`}
      >
        {m}
      </motion.button>
    ))}
  </div>
);

export default MoodSelector;
  