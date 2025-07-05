import React from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Calendar, Shield } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const upiId = user?.upiId || localStorage.getItem('gpay_upi_id') || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 pt-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text mb-6">
            Profile
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your account and preferences
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-[#1db954] to-[#1e90ff] rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.profile?.firstName || user?.firstName || user?.username || 'User'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.email || 'No email provided'}
              </p>
              {user?.profile?.phone && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">📞 {user.profile.phone}</p>
              )}
              {upiId && (
                <p className="text-green-600 dark:text-green-400 text-sm mt-2">UPI Linked: {upiId}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Information
              </h3>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <User className="w-5 h-5 text-[#1db954]" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.profile?.firstName && user?.profile?.lastName 
                      ? `${user.profile.firstName} ${user.profile.lastName}`
                      : user?.profile?.firstName || user?.firstName || user?.username || 'Not set'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Mail className="w-5 h-5 text-[#1db954]" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.email || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-5 h-5 text-[#1db954] text-center">📞</div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.profile?.phone || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Calendar className="w-5 h-5 text-[#1db954]" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Status
              </h3>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Shield className="w-5 h-5 text-[#1db954]" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Onboarding</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.onboardingComplete ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#1db954]/10 to-[#1e90ff]/10 rounded-lg border border-[#1db954]/20">
                <h4 className="font-semibold text-[#1db954] mb-2">Account Features</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Real-time transaction tracking</li>
                  <li>• Financial insights and analytics</li>
                  <li>• Spending coach and recommendations</li>
                  <li>• Investment guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 