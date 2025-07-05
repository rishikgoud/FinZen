import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1db954] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render register form if already logged in
  if (isLoggedIn) {
    return null;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/register`, {
        email,
        password,
        profile: { firstName: username },
      });

      // Automatically log the user in after successful registration
      const loginRes = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/login`, {
        email,
        password,
      });

      const { token, user } = loginRes.data;

      // Clear any existing UPI data to ensure new user starts fresh
      localStorage.removeItem("gpay_token");
      localStorage.removeItem("gpay_upi_id");

      // Use the new login method from AuthContext with isNewUser flag
      login(token, { ...user, isNewUser: true, onboardingComplete: false });

      toast.success("Registration successful! Let's set up your account.");
      setTimeout(() => {
        navigate("/"); // Redirect to home page where RequireOnboarding will handle the flow
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      toast.error(msg);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center pt-8 justify-center overflow-hidden bg-[#0a0f1c]">
      <Toaster position="top-center" />

      {/* 🫧 Floating Bubbles Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="blobGradient" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#1db954" />
              <stop offset="100%" stopColor="#1e3c72" />
            </radialGradient>
          </defs>
          <g fill="url(#blobGradient)" fillOpacity="0.12">
            {[...Array(25)].map((_, i) => {
              const r = Math.random() * 40 + 20;
              const cx = Math.random() * 1800;
              const cy = Math.random() * 1000;
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

      {/* 📝 Register Card */}
      <div className="z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white animate-fade-in border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
          Create FinZen Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-lime-300"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-lime-300"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-lime-300"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {/* Confirm Password with toggle */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 pr-12 rounded-lg bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-lime-300"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-green-500 transition-all font-semibold rounded-lg"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:text-lime-300">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
