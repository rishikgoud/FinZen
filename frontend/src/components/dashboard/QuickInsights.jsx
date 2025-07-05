import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FaPiggyBank, 
  FaWallet, 
  FaArrowUp, 
  FaArrowDown, 
  FaExclamationTriangle,
  FaChartBar,
  FaBullseye,
  FaLink,
  FaCrown,
  FaLightbulb,
  FaClock,
  FaCalendar,
  FaArrowRight,
  FaMinus,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";
import { fetchInsights } from "../../utils/api";
import { logError } from '../../utils/logger';

const iconMap = {
  welcome: <FaCrown />,
  goal: <FaBullseye />,
  connect: <FaLink />,
  spending: <FaWallet />,
  savings: <FaPiggyBank />,
  alert: <FaExclamationTriangle />,
  category: <FaChartBar />,
  income: <FaArrowRight />,
  achievement: <FaCheckCircle />,
  warning: <FaExclamationTriangle />,
  optimization: <FaLightbulb />,
  frequency: <FaClock />,
  pattern: <FaCalendar />
};

const colorMap = {
  welcome: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300",
  goal: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300",
  connect: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300",
  spending: "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300",
  savings: "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300",
  alert: "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300",
  category: "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300",
  income: "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300",
  achievement: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300",
  warning: "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300",
  optimization: "bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300",
  frequency: "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300",
  pattern: "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300"
};

const trendIconMap = {
  up: <FaArrowUp className="text-green-400" />,
  down: <FaArrowDown className="text-red-400" />,
  positive: <FaArrowUp className="text-green-400" />,
  negative: <FaArrowDown className="text-red-400" />,
  neutral: <FaMinus className="text-gray-400" />
};

const QuickInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInsights = async () => {
      try {
        setLoading(true);
        const data = await fetchInsights();
        
        // Validate data structure and handle both old and new formats
        if (Array.isArray(data)) {
          // Check if data is in new format (objects) or old format (strings)
          const isValidNewFormat = data.length > 0 && typeof data[0] === 'object' && data[0].title;
          
          if (isValidNewFormat) {
            setInsights(data);
          } else {
            // Handle old format (strings) - convert to new format
            const convertedData = data.map((tip, index) => {
              if (typeof tip === 'string') {
                // Simple keyword matching for old format
                if (tip.includes("saving") || tip.toLowerCase().includes("goal")) {
                  return { title: tip, amount: "₹12,000", type: "savings", description: "Based on your spending patterns" };
                } else if (tip.toLowerCase().includes("revenue") || tip.includes("week")) {
                  return { title: tip, amount: "₹4,000", type: "income", description: "Weekly analysis" };
                } else if (tip.toLowerCase().includes("food")) {
                  return { title: tip, amount: "₹500", type: "category", description: "Food spending insight" };
                } else {
                  return { title: tip, amount: "₹0", type: "welcome", description: "General insight" };
                }
              }
              return tip; // Already in correct format
            });
            setInsights(convertedData);
          }
        } else {
          // Fallback for invalid data
          setInsights([
            {
              title: "Welcome to FinZen!",
              amount: "₹0",
              type: "welcome",
              description: "Start adding transactions to get personalized insights"
            }
          ]);
        }
      } catch (error) {
        logError(error, "QuickInsights");
        // Fallback insights
        setInsights([
          {
            title: "Welcome to FinZen!",
            amount: "₹0",
            type: "welcome",
            description: "Start adding transactions to get personalized insights"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    getInsights();
  }, []);

  if (loading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-6 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
        Quick Insights
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-full overflow-x-auto">
        {insights && insights.length > 0 ? insights.map((item, idx) => {
          // Safety check for item structure
          if (!item || typeof item !== 'object') {
            return null;
          }
          
          const safeItem = {
            title: item.title || "Insight",
            amount: item.amount || "₹0",
            type: item.type || "welcome",
            description: item.description || "",
            trend: item.trend || null
          };
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-md hover:scale-[1.02] transition-all min-w-0 group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full text-xl ${colorMap[safeItem.type] || colorMap.welcome} group-hover:scale-110 transition-transform`}>
                  {iconMap[safeItem.type] || iconMap.welcome}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-white/60 truncate">{safeItem.title}</p>
                    {safeItem.trend && trendIconMap[safeItem.trend] && (
                      <span className="text-xs">
                        {trendIconMap[safeItem.trend]}
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-bold text-white mb-1">{safeItem.amount}</p>
                  {safeItem.description && (
                    <p className="text-xs text-white/50 leading-relaxed">
                      {safeItem.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        }) : (
          // Fallback when no insights are available
          <div className="col-span-full text-center py-8">
            <p className="text-white/60">No insights available yet. Add some transactions to get started!</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-right">
        <a 
          href="/dashboard/spending-coach" 
          className="inline-flex items-center gap-2 text-sm text-[#1db954] hover:text-[#1e90ff] transition-colors font-semibold group"
        >
          View detailed insights
          <FaArrowUp className="transform rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default QuickInsights;
