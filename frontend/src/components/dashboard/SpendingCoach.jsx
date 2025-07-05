import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGPayUser } from '../../context/GPayUserContext';
import InsightCard from '../SpendingCoach/InsightCard';
import QuestionChips from '../SpendingCoach/QuestionChips';
import AIAvatar from '../SpendingCoach/AIAvatar';
import ActionCards from '../SpendingCoach/ActionCards';
import AdventureMap from '../SpendingCoach/AdventureMap';
import BadgeShelf from '../SpendingCoach/BadgeShelf';
// import AIAvatar from '../SpendingCoach/AIAvatar';

// Placeholder imports for future modules
// import SpendingTimeline from './SpendingTimeline';
// import GoalNudger from './GoalNudger';
// import MoodFeedback from './MoodFeedback';
// import SwipeSuggestions from './SwipeSuggestions';
// import WeeklyReports from './WeeklyReports';

const neonBg = '';
const neonGlow = '';
const neonCard = 'bg-[#10182a] border border-[#4f8cff44] rounded-2xl p-4 mb-6 shadow-[0_0_24px_4px_#4f8cff55]';

const SUGGESTIONS = [
  'Where did I overspend?',
  'Can I save more?',
  "What's my biggest leak?"
];

const MOODS = [
  { icon: '😃', label: 'Happy' },
  { icon: '😐', label: 'Neutral' },
  { icon: '😬', label: 'Stressed' },
  { icon: '😢', label: 'Sad' },
];

const SpendingCoach = () => {
  const { transactions } = useGPayUser();
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [avatarReaction, setAvatarReaction] = useState('');
  const [avatarMsg, setAvatarMsg] = useState('');
  const [avatarTyping, setAvatarTyping] = useState(false);
  const currentLevel = 2; // mock: user is at level 2
  const unlockedBadges = [0, 1]; // mock: first two badges unlocked

  // Group transactions by day (last 7 days)
  const timelineData = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    const now = new Date();
    // Create 7 days array
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      return {
        date: d,
        label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        total: 0,
      };
    });
    // Sum expenses for each day
    transactions.forEach(txn => {
      if (!txn.date || txn.type !== 'expense') return;
      const txnDate = new Date(txn.date);
      for (let i = 0; i < days.length; i++) {
        if (
          txnDate.getFullYear() === days[i].date.getFullYear() &&
          txnDate.getMonth() === days[i].date.getMonth() &&
          txnDate.getDate() === days[i].date.getDate()
        ) {
          days[i].total += txn.amount || 0;
        }
      }
    });
    return days;
  }, [transactions]);

  // Find max spending for overspending highlight
  const maxSpending = Math.max(...timelineData.map(d => d.total), 0);
  const overspendingIdx = timelineData.findIndex(d => d.total === maxSpending && maxSpending > 0);

  // Fetch AI insight
  const fetchAIInsight = async (userQuery = '', mood = selectedMood) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/spending-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, mood, userQuery }),
      });
      const data = await res.json();
      setAiResponse(data.message || 'No advice available.');
    } catch (err) {
      setAiResponse('Could not fetch advice.');
    }
    setLoading(false);
  };

  // Initial AI insight on mount
  useEffect(() => {
    fetchAIInsight();
    // eslint-disable-next-line
  }, [transactions]);

  // Handle question chip tap or mood select
  const handleAIQuery = (userQuery) => {
    fetchAIInsight(userQuery, selectedMood);
  };
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    fetchAIInsight('', mood);
  };

  // Sample actions for ActionCards
  const ACTIONS = [
    { text: 'Skip 2 coffee outings = ₹360 saved', icon: '☕' },
    { text: 'Pause unused OTT subscription?', icon: '📺' },
  ];

  // Handle action card act
  const handleActionAct = (action, idx) => {
    setAvatarReaction('celebrate');
    setAvatarMsg('Great job! You just boosted your savings! 🚀');
    setAvatarTyping(true);
    setTimeout(() => {
      setAvatarReaction(selectedMood || 'default');
      setAvatarMsg('');
      setAvatarTyping(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen w-full text-white overflow-x-hidden bg-gradient-to-br from-[#0a0f1c] via-[#1a2a4f] to-[#0a0f1c]">
      <AIAvatar mood={selectedMood || 'default'} reaction={avatarReaction} message={avatarMsg} typing={avatarTyping} />
      <div className="relative z-10 w-full px-2 sm:px-6 lg:px-16 pt-24 pb-12 flex flex-col gap-8">
        <AdventureMap currentLevel={currentLevel} />
        {/* Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-cyan-300 drop-shadow-lg mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          FinZen AI Spending Coach
        </motion.h1>
        <motion.p
          className="text-lg text-cyan-200 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Personalized, gamified financial insights. Explore your spending, get smart nudges, and level up your money habits!
        </motion.p>

        <div className="flex flex-wrap gap-4 items-center mb-2">
          <span className="text-cyan-200 font-semibold">How are you feeling?</span>
          {MOODS.map(m => (
            <button
              key={m.icon}
              onClick={() => handleMoodSelect(m.icon)}
              className={`text-2xl p-2 rounded-full border-2 ${selectedMood === m.icon ? 'border-cyan-400 bg-cyan-900' : 'border-transparent bg-[#1a2a4f]'} hover:bg-cyan-800 transition`}
            >
              {m.icon}
            </button>
          ))}
        </div>
        <QuestionChips suggestions={SUGGESTIONS} onSelect={handleAIQuery} />
        {aiResponse && <InsightCard aiResponse={aiResponse} loading={loading} />}
        <ActionCards actions={ACTIONS} onAct={handleActionAct} />
        <BadgeShelf unlocked={unlockedBadges} />

        {/* Responsive dashboard grid for modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Spending Timeline Explorer */}
          <motion.div className={neonCard} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span>📅</span> Where did my money go?
      </div>
            <div className="h-32 flex items-end gap-2 overflow-x-auto scrollbar-hide relative">
              {timelineData.map((d, i) => (
                <div key={i} className="flex flex-col items-center justify-end relative">
                  {/* AI nudge above overspending bar */}
                  {i === overspendingIdx && maxSpending > 0 && (
          <motion.div
                      className="absolute -top-8 left-1/2 -translate-x-1/2 bg-pink-600/90 text-xs px-3 py-1 rounded-xl shadow-lg animate-pulse z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Overspent ₹{maxSpending.toLocaleString()}!
                    </motion.div>
                  )}
                  <motion.div
                    className={`w-8 rounded-lg ${i === overspendingIdx && maxSpending > 0 ? 'bg-pink-500 shadow-[0_0_16px_2px_#ff4fa3]' : 'bg-cyan-500'} transition-all duration-300`}
                    style={{ height: `${maxSpending > 0 ? Math.max(24, (d.total / maxSpending) * 96) : 24}px` }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                  />
                  <span className="mt-2 text-xs text-cyan-200">{d.label}</span>
                  <span className="text-xs text-cyan-400">₹{d.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
          {/* Smart Goal Nudger */}
          <motion.div className={neonCard} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span>🎯</span> Smart Goal Nudger
      </div>
            <div className="flex flex-col gap-3">
              {/* Animated progress meters */}
              <div className="flex items-center gap-3">
                <span className="w-20">Savings</span>
                <div className="flex-1 h-3 bg-[#1a2a4f] rounded-full overflow-hidden">
                  <motion.div className="h-3 bg-green-400 rounded-full" initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 1.2 }} />
      </div>
                <span className="ml-2 text-green-300">70%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20">Dining</span>
                <div className="flex-1 h-3 bg-[#1a2a4f] rounded-full overflow-hidden">
                  <motion.div className="h-3 bg-pink-400 rounded-full" initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1.2, delay: 0.2 }} />
        </div>
                <span className="ml-2 text-pink-300">45%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20">Shopping</span>
                <div className="flex-1 h-3 bg-[#1a2a4f] rounded-full overflow-hidden">
                  <motion.div className="h-3 bg-cyan-400 rounded-full" initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1.2, delay: 0.4 }} />
                </div>
                <span className="ml-2 text-cyan-300">60%</span>
              </div>
            </div>
          </motion.div>
          {/* Mood-Based Finance Feedback */}
          <motion.div className={neonCard} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span>🧠</span> What's my money mood today?
            </div>
            <div className="flex gap-4 items-center">
              {/* Mood selector */}
              {['😃', '😐', '😬', '😢'].map((mood, i) => (
                <motion.button
                  key={mood}
                  whileTap={{ scale: 0.9 }}
                  className="text-3xl p-2 rounded-full bg-[#1a2a4f] hover:bg-cyan-800 focus:ring-2 focus:ring-cyan-400"
                >
                  {mood}
                </motion.button>
              ))}
              <span className="ml-4 text-cyan-200">Coach adapts advice to your mood!</span>
            </div>
          </motion.div>
          {/* Swipe-to-Act AI Suggestions */}
          <motion.div className={neonCard} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <div className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span>💡</span> Swipe-to-Act Suggestions
        </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {/* Swipeable suggestion cards (placeholder) */}
              {[{ text: 'Skip 2 coffee outings = ₹360 saved', icon: '☕' }, { text: 'Pause unused OTT subscription?', icon: '📺' }].map((s, i) => (
          <motion.div
                  key={i}
                  className="min-w-[220px] bg-[#181f36] border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                  whileTap={{ scale: 0.95, rotate: i === 0 ? -5 : 5 }}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-cyan-100 text-center">{s.text}</span>
                  <button className="mt-2 px-3 py-1 bg-cyan-700 rounded-full text-xs text-white hover:bg-cyan-500 transition">Act</button>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* Weekly Personal Finance Reports */}
          <motion.div className={neonCard} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <div className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <span>📬</span> Weekly Personal Finance Reports
            </div>
            <div className="flex gap-4 flex-wrap">
              {/* Digital postcard cards (placeholder) */}
              {[{ title: "This week's Hero: Grocery Budget", emoji: '🛒' }, { title: "Villain: Food Delivery 😬", emoji: '🍔' }].map((r, i) => (
            <motion.div
                  key={i}
                  className="w-44 h-28 bg-gradient-to-br from-[#1a2a4f] to-[#4f8cff33] border border-cyan-400/30 rounded-xl p-3 flex flex-col justify-between shadow-lg hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
            >
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-cyan-100 text-sm">{r.title}</span>
                  <span className="text-xs text-cyan-400 mt-2">Collectible</span>
            </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SpendingCoach; 