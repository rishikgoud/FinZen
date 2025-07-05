import { Toaster } from 'react-hot-toast';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";  
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import SpendingCoachPage from './pages/SpendingCoach';
import MicroInvestorGuidePage from './pages/MicroInvestorGuide';
import LoanEligibilityPage from './pages/LoanEligibility';
import Resources from './pages/Resources';
import Onboarding from './pages/Onboarding';
import ExploreLearning from './pages/ExploreLearning';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import IncomeTaxCalculator from './pages/IncomeTaxCalculator';
import LoanEstimator from './pages/LoanEstimator';
import SetGoals from './pages/SetGoals';
import LimitBudget from './pages/LimitBudget';
import { CategoryProgressProvider } from './context/CategoryProgressContext';
import NotFound from './pages/NotFound';



// ...

// RequireOnboarding wrapper component
const RequireOnboarding = ({ children }) => {
  const { user, isLoggedIn, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1db954] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Only show onboarding if user is new (just registered) and hasn't completed onboarding
  // Existing users who login should not see onboarding even if they haven't completed it
  const isNewUser = user?.isNewUser === true;
  const hasCompletedOnboarding = user?.onboardingComplete === true;
  
  if (isNewUser && !hasCompletedOnboarding) {
    return <Onboarding />;
  }
  
  return children;
};

// Placeholder components for new routes
const ExploreSpendingCoach = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 pt-24">
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text mb-6">
          Spending Coach
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Get personalized advice to optimize your spending and achieve your financial goals.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        <p className="text-gray-600 dark:text-gray-300 text-center">
          This feature is coming soon! You'll be able to get AI-powered spending advice and personalized recommendations.
        </p>
      </div>
    </div>
  </div>
);

const ExploreLoanEstimator = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-24">
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text mb-6">
          Loan Estimator
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Calculate your loan eligibility and get personalized loan recommendations.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        <p className="text-gray-600 dark:text-gray-300 text-center">
          This feature is coming soon! You'll be able to estimate loan amounts, calculate EMIs, and check eligibility.
        </p>
      </div>
    </div>
  </div>
);



function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/explore/spending-coach" element={<SpendingCoachPage />} />
        <Route path="/explore/income-tax-calculator" element={<IncomeTaxCalculator />} />
        <Route path="/explore/learning" element={<ExploreLearning />} />
        <Route path="/dashboard" element={
          <RequireOnboarding>
            <Dashboard />
          </RequireOnboarding>
        } />
        <Route path="/profile" element={
          <RequireOnboarding>
            <Profile />
          </RequireOnboarding>
        } />
        <Route path="/dashboard/settings" element={
          <RequireOnboarding>
            <Settings />
          </RequireOnboarding>
        } />
        <Route path="/notifications" element={
          <RequireOnboarding>
            <Notifications />
          </RequireOnboarding>
        } />
        <Route path="/dashboard/spending-coach" element={
          <RequireOnboarding>
            <SpendingCoachPage />
          </RequireOnboarding>
        } />
        <Route path="/dashboard/micro-investor" element={
          <RequireOnboarding>
            <MicroInvestorGuidePage />
          </RequireOnboarding>
        } />
        <Route path="/dashboard/loan-eligibility" element={
          <RequireOnboarding>
            <LoanEligibilityPage />
          </RequireOnboarding>
        } />
        <Route path="/resources" element={<Resources />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/explore/loan-estimator" element={<LoanEstimator />} />
        <Route path="/set-goals" element={<SetGoals />} />
        <Route path="/limit-budget" element={<LimitBudget />} />
        <Route path="*" element={<NotFound />} />


        </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const { isLoggedIn } = useAuth();

  // Inject chat widget only if logged in
  useEffect(() => {
    const scriptId = 'omnidimension-web-widget';
    if (isLoggedIn) {
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=e5fac8d1d091a10aa2b7719ea85af890';
        document.body.appendChild(script);
      }
    } else {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    }
  }, [isLoggedIn]);
  

  return (
    <>
      <Navbar />
      <Toaster position="top-center" />
      <AnimatedRoutes />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CategoryProgressProvider>
      <AppContent />
      </CategoryProgressProvider>
    </AuthProvider>
  );
}

export default App;
