import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Smartphone, 
  Target, 
  ShoppingBag, 
  User, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft
} from "lucide-react";

// Step 1: Connect UPI App
const ConnectUPIStep = ({ onNext, onBack, onConnect, connectedUpiId }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: '💚' },
    { id: 'phonepe', name: 'PhonePe', icon: '💜' },
    { id: 'paytm', name: 'Paytm', icon: '💙' }
  ];

  const handleConnect = async () => {
    if (!selectedApp || !upiId || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/upi/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiId, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('gpay_token', data.token);
      localStorage.setItem('gpay_upi_id', upiId);
      onConnect(upiId); // Pass upiId to parent
      setError('');
    } catch (err) {
      setError('Invalid UPI ID or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 mx-auto bg-gradient-to-r from-[#1db954] to-[#1e90ff] rounded-full flex items-center justify-center"
        >
          <Smartphone className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
          Connect Your UPI App
        </h2>
        <p className="text-white/70 text-base sm:text-lg">
          Link your preferred UPI app to enable real-time transaction tracking and personalized insights
        </p>
      </div>
      {connectedUpiId ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-green-400 font-semibold">
            <CheckCircle className="w-5 h-5" />
            Connected: {connectedUpiId}
            </div>
          <button
            className="px-8 py-2 rounded-full bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-semibold shadow-lg hover:scale-105 transition-all"
            onClick={onNext}
          >
            Continue
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {upiApps.map((app) => (
              <motion.button
                key={app.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedApp(app.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedApp === app.id
                    ? 'border-[#1db954] bg-gradient-to-r from-[#1db954]/20 to-[#1e90ff]/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <div className="text-3xl mb-2">{app.icon}</div>
                <div className="text-sm font-medium">{app.name}</div>
              </motion.button>
                ))}
              </div>
          {selectedApp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 max-w-md mx-auto"
            >
              <div className="text-left">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g., user@upi)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]"
                />
                <p className="text-xs text-white/60 mt-1">
                  Format: username@bank or username@upi
                </p>
              </div>
              <div className="text-left">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your UPI app password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </motion.div>
          )}
          <div className="flex flex-col sm:flex-row justify-between gap-4 max-w-md mx-auto">
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
                  <button
              onClick={handleConnect}
              disabled={!selectedApp || !upiId || !password || loading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-medium hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 transition-all disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect'}
              <ArrowRight className="w-4 h-4" />
                  </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

// Step 2: Financial Goals
const FinancialGoalsStep = ({ onNext, onBack }) => {
  const [selectedGoals, setSelectedGoals] = useState([]);

  const goals = [
    { id: 'savings', name: 'Build Savings', icon: '💰', xp: 100 },
    { id: 'investment', name: 'Start Investing', icon: '📈', xp: 150 },
    { id: 'debt', name: 'Pay Off Debt', icon: '💳', xp: 120 },
    { id: 'emergency', name: 'Emergency Fund', icon: '🛡️', xp: 80 },
    { id: 'retirement', name: 'Retirement Plan', icon: '🏖️', xp: 200 },
    { id: 'house', name: 'Buy a House', icon: '🏠', xp: 300 }
  ];

  const toggleGoal = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const totalXP = selectedGoals.reduce((sum, goalId) => {
    const goal = goals.find(g => g.id === goalId);
    return sum + (goal?.xp || 0);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 mx-auto bg-gradient-to-r from-[#1db954] to-[#1e90ff] rounded-full flex items-center justify-center"
        >
          <Target className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
          Set Your Financial Goals
        </h2>
        <p className="text-white/70 text-base sm:text-lg">
          Choose your financial objectives and earn XP points
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {goals.map((goal) => (
          <motion.button
            key={goal.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleGoal(goal.id)}
            className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
              selectedGoals.includes(goal.id)
                ? 'border-[#1db954] bg-gradient-to-r from-[#1db954]/20 to-[#1e90ff]/20'
                : 'border-white/20 bg-white/5 hover:border-white/40'
            }`}
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{goal.icon}</div>
            <div className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">{goal.name}</div>
            <div className="text-xs sm:text-sm text-[#1db954]">+{goal.xp} XP</div>
          </motion.button>
                ))}
              </div>

      {selectedGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#1db954]/20 to-[#1e90ff]/20 rounded-lg p-4 max-w-md mx-auto"
        >
          <div className="text-2xl font-bold text-[#1db954]">+{totalXP} XP Earned!</div>
          <div className="text-white/70">Great choices! You're on your way to financial success.</div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4 max-w-md mx-auto">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedGoals.length === 0}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-medium hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 transition-all disabled:opacity-50"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
              </div>
            </motion.div>
  );
};

// Step 3: Spending Categories
const SpendingCategoriesStep = ({ onNext, onBack }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    { id: 'food', name: 'Food & Dining', icon: '🍕' },
    { id: 'transport', name: 'Transportation', icon: '🚗' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'health', name: 'Healthcare', icon: '🏥' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'bills', name: 'Bills & Utilities', icon: '⚡' },
    { id: 'travel', name: 'Travel', icon: '✈️' }
  ];

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
            <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 mx-auto bg-gradient-to-r from-[#1db954] to-[#1e90ff] rounded-full flex items-center justify-center"
        >
          <ShoppingBag className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
          Spending Categories
        </h2>
        <p className="text-white/70 text-base sm:text-lg">
          Select categories to track your spending patterns
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleCategory(category.id)}
            className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
              selectedCategories.includes(category.id)
                ? 'border-[#1db954] bg-gradient-to-r from-[#1db954]/20 to-[#1e90ff]/20'
                : 'border-white/20 bg-white/5 hover:border-white/40'
            }`}
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{category.icon}</div>
            <div className="font-medium text-sm sm:text-base">{category.name}</div>
          </motion.button>
        ))}
                </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 max-w-md mx-auto">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedCategories.length === 0}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-medium hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 transition-all disabled:opacity-50"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
              </div>
            </motion.div>
  );
};

// Step 4: Personal Details
const PersonalDetailsStep = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    age: '',
    occupation: '',
    income: '',
    experience: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
            <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 mx-auto bg-gradient-to-r from-[#1db954] to-[#1e90ff] rounded-full flex items-center justify-center"
        >
          <User className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
          Tell Us About Yourself
        </h2>
        <p className="text-white/70 text-base sm:text-lg">
          Help us personalize your financial experience
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="space-y-2">
          <label className="block text-left text-white/70 font-medium">Age</label>
          <input
            type="number"
            placeholder="25"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-left text-white/70 font-medium">Occupation</label>
          <select
            value={formData.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-700 text-white focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]"
          >
            <option value="">Select occupation</option>
            <option value="student">Student</option>
            <option value="employee">Employee</option>
            <option value="freelancer">Freelancer</option>
            <option value="business">Business Owner</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-left text-white/70 font-medium">Monthly Income</label>
                <select
            value={formData.income}
            onChange={(e) => handleChange('income', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-700 text-white focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]"
          >
            <option value="">Select income range</option>
            <option value="0-25000">₹0 - ₹25,000</option>
            <option value="25000-50000">₹25,000 - ₹50,000</option>
            <option value="50000-100000">₹50,000 - ₹1,00,000</option>
            <option value="100000+">₹1,00,000+</option>
                </select>
        </div>
        <div className="space-y-2">
          <label className="block text-left text-white/70 font-medium">Financial Experience</label>
                <select
            value={formData.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-700 text-white focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]"
          >
            <option value="">Select experience level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
                </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 max-w-md mx-auto">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
                <button
          onClick={onNext}
          disabled={!isFormValid}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-medium hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 transition-all disabled:opacity-50"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
                </button>
      </div>
    </motion.div>
  );
};

// Step 5: Completion
const CompletionStep = ({ onFinish }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 mx-auto bg-gradient-to-r from-[#1db954] to-[#1e90ff] rounded-full flex items-center justify-center"
      >
        <CheckCircle className="w-12 h-12 text-white" />
      </motion.div>

      <div className="space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text"
        >
          Welcome to FinZen! 🎉
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-white/70 text-base sm:text-lg"
        >
          Your financial journey starts now. Let's make your money work smarter!
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-[#1db954]/20 to-[#1e90ff]/20 rounded-lg p-6 max-w-md mx-auto"
      >
        <div className="text-2xl font-bold text-[#1db954] mb-2">+500 XP Earned!</div>
        <div className="text-white/70">You've completed the onboarding and unlocked all features!</div>
            </motion.div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 1, 
                x: Math.random() * window.innerWidth, 
                y: -10 
              }}
              animate={{ 
                opacity: 0, 
                y: window.innerHeight + 10,
                x: Math.random() * window.innerWidth
              }}
              transition={{ 
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5
              }}
              className="absolute w-2 h-2 bg-gradient-to-r from-[#1db954] to-[#1e90ff] rounded-full"
            />
          ))}
        </div>
      )}
            </motion.div>
  );
};

// Main Onboarding Component
const Onboarding = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { updateUser, user } = useAuth();
  const navigate = useNavigate();
  const totalSteps = 5;

  // For new users, don't automatically use existing UPI data
  // They must go through the UPI setup process
  const [connectedUpiId, setConnectedUpiId] = useState("");

  const handleNext = () => {
    // Only allow next if UPI is connected on step 1
    if (currentStep === 1 && !connectedUpiId) return;
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConnectUpi = (upiId) => {
    setConnectedUpiId(upiId);
    // Save to user object for profile/settings
    const updatedUser = {
      ...user,
      upiId,
    };
    updateUser(updatedUser);
  };

  const handleComplete = async () => {
    // Update user with onboarding completion and remove isNewUser flag
    const updatedUser = {
      ...user,
      onboardingComplete: true,
      isNewUser: false
    };
    updateUser(updatedUser);
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0f1c] flex flex-col overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-10">
        <motion.div
          className="h-full bg-gradient-to-r from-[#1db954] to-[#1e90ff]"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Step Counter */}
      <div className="absolute top-4 right-4 text-white/70 z-10">
        Step {currentStep} of {totalSteps}
      </div>
      
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-16">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-[#0a0f1c]/95 backdrop-blur-xl rounded-3xl border border-gray-800 p-4 sm:p-8 min-h-[500px] flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <ConnectUPIStep key="step1" onNext={handleNext} onBack={handleBack} onConnect={handleConnectUpi} connectedUpiId={connectedUpiId} />
                )}
                {currentStep === 2 && (
                  <FinancialGoalsStep key="step2" onNext={handleNext} onBack={handleBack} />
                )}
                {currentStep === 3 && (
                  <SpendingCategoriesStep key="step3" onNext={handleNext} onBack={handleBack} />
                )}
                {currentStep === 4 && (
                  <PersonalDetailsStep key="step4" onNext={handleNext} onBack={handleBack} />
                )}
                {currentStep === 5 && (
                  <CompletionStep key="step5" onFinish={handleComplete} />
          )}
        </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;