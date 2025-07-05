import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="relative min-h-screen bg-[#0a0f1c] text-white overflow-hidden">
      {/* 🌟 Bubbles across entire page - matching landing page */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="bubbleGradient" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#1db954" />
              <stop offset="100%" stopColor="#1e3c72" />
            </radialGradient>
          </defs>
          <g fill="url(#bubbleGradient)" fillOpacity="0.12">
            {Array.from({ length: 220 }).map((_, i) => {
              const r = Math.random() * 60 + 30;
              const cx = Math.random() * window.innerWidth;
              const cy = Math.random() * 10000;
              return (
                <circle
                  key={i}
                  r={r}
                  cx={cx}
                  cy={cy}
                  className={`animate-bubble-float animation-delay-${i % 10}`}
                />
              );
            })}
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 min-h-screen">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="text-7xl sm:text-9xl font-extrabold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text mb-6 drop-shadow-lg"
        >
          404
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-2xl sm:text-4xl font-bold text-white mb-4"
        >
          Page Not Found
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-white/70 text-lg mb-8 max-w-xl"
        >
          Oops! The page you are looking for does not exist or has been moved.<br />
          Let's get you back to a safe place.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <Link
            to="/"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-semibold shadow-lg hover:scale-105 hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 transition-all text-lg"
          >
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound; 