import { motion } from "framer-motion";
import {
  FaChartPie,
  FaFileUpload,
  FaBell,
  FaWallet,
  FaExchangeAlt,
  FaBookOpen,
} from "react-icons/fa";
import AnimatedBackground from "../ui/AnimatedBackground";

const features = [
  {
    icon: <FaChartPie size={28} />,
    title: "Smart Dashboard",
    desc: "Track budgets, savings goals, and financial summaries with ease.",
  },
  {
    icon: <FaBookOpen size={28} />,
    title: "Financial Resources",
    desc: "Educate yourself with curated guides, articles, and tools for financial planning, budgeting, and investing.",
  },
  {
    icon: <FaFileUpload size={28} />,
    title: "Multi Upload Support",
    desc: "Upload JSON, CSV, or enter data manually with auto-suggestions.",
  },
  {
    icon: <FaBell size={28} />,
    title: "Smart Nudges",
    desc: "Get alerts and financial nudges based on your spending patterns.",
  },
  {
    icon: <FaWallet size={28} />,
    title: "UPI Wallet Sync",
    desc: "Monitor your PhonePe, GPay, Paytm & more in one unified dashboard.",
  },
  {
    icon: <FaExchangeAlt size={28} />,
    title: "Transaction Insights",
    desc: "Visualize monthly trends and dive into categories with ease.",
  },
];

const FeatureSection = () => {
  return (
    <section className="relative py-20 text-white bg-[#0a0f1c] overflow-hidden">
      {/* Bubble background behind the entire section */}
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          What <span className="font-extrabold">FinZen</span> Can Do for You
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-white/10 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex justify-center mb-4 text-[#d1a6ff] group-hover:text-[#e6ccff] transition">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-center text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
