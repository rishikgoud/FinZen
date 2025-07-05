import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, X, User, Lock, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [upiId, setUpiId] = useState(user?.upiId || localStorage.getItem('gpay_upi_id') || '');
  const [showConnect, setShowConnect] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newUpiId, setNewUpiId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Edit Profile Modal States
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.profile?.firstName || user?.firstName || user?.username || '',
    lastName: user?.profile?.lastName || user?.lastName || '',
    email: user?.email || '',
    phone: user?.profile?.phone || user?.phone || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Change Password Modal States
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: '💚' },
    { id: 'phonepe', name: 'PhonePe', icon: '💜' },
    { id: 'paytm', name: 'Paytm', icon: '💙' }
  ];

  // Edit Profile Functions
  const handleEditProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE}/user/profile`,
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const updatedUserData = { ...user, ...response.data };
      updateUser(updatedUserData);
      setShowEditProfile(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Change Password Functions
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_BASE}/user/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleDisconnect = () => {
    setUpiId('');
    localStorage.removeItem('gpay_token');
    localStorage.removeItem('gpay_upi_id');
    const updatedUser = { ...user };
    delete updatedUser.upiId;
    updateUser(updatedUser);
  };

  const handleConnect = async () => {
    if (!selectedApp || !newUpiId || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://gpay-upi-backend-finzen.onrender.com/upi/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiId: newUpiId, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('gpay_token', data.token);
      localStorage.setItem('gpay_upi_id', newUpiId);
      setUpiId(newUpiId);
      setShowConnect(false);
      setSelectedApp(null);
      setNewUpiId('');
      setPassword('');
      const updatedUser = { ...user, upiId: newUpiId };
      updateUser(updatedUser);
    } catch (err) {
      setError('Invalid UPI ID or password');
    } finally {
    setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        occupation: formData.occupation,
        annualIncome: formData.annualIncome,
        financialGoals: formData.financialGoals
      });

      if (response) {
        toast.success('Profile updated successfully!');
        setUser(response);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 pt-24">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text mb-6">
            Settings
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Customize your FinZen experience
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Settings */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-[#1db954]" />
                Account Settings
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Profile Information</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Update your personal information and preferences
                  </p>
                  <button className="mt-2 text-[#1db954] hover:text-[#1db954]/80 text-sm font-medium" onClick={() => setShowEditProfile(true)}>
                    Edit Profile
                  </button>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Change Password</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Update your account password for security
                  </p>
                  <button className="mt-2 text-[#1db954] hover:text-[#1db954]/80 text-sm font-medium" onClick={() => setShowChangePassword(true)}>
                    Change Password
                  </button>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Add an extra layer of security to your account
                  </p>
                  <button className="mt-2 text-[#1db954] hover:text-[#1db954]/80 text-sm font-medium">
                    Enable 2FA
                  </button>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">UPI Connection</h4>
                  {upiId ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-green-600 dark:text-green-400 font-medium">Connected: {upiId}</span>
                      <button
                        className="mt-1 px-4 py-2 rounded bg-red-500 text-white text-sm font-medium hover:bg-red-600 w-fit"
                        onClick={handleDisconnect}
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : showConnect ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {upiApps.map((app) => (
                          <button
                            key={app.id}
                            onClick={() => setSelectedApp(app.id)}
                            className={`p-2 rounded-xl border-2 transition-all duration-300 ${
                              selectedApp === app.id
                                ? 'border-[#1db954] bg-gradient-to-r from-[#1db954]/20 to-[#1e90ff]/20'
                                : 'border-white/20 bg-white/5 hover:border-white/40'
                            }`}
                          >
                            <div className="text-2xl mb-1">{app.icon}</div>
                            <div className="text-xs font-medium">{app.name}</div>
                  </button>
                ))}
                      </div>
                      {selectedApp && (
                        <>
                          <input
                            type="text"
                            placeholder="Enter UPI ID (e.g., user@upi)"
                            value={newUpiId}
                            onChange={e => setNewUpiId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#1db954]"
                          />
                          <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#1db954]"
                          />
                        </>
                      )}
                      {error && <p className="text-red-400 text-sm">{error}</p>}
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleConnect}
                          disabled={!selectedApp || loading}
                          className="px-4 py-2 rounded bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white text-sm font-medium hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 disabled:opacity-50"
                        >
                          {loading ? 'Connecting...' : 'Connect'}
                        </button>
                        <button
                          onClick={() => setShowConnect(false)}
                          className="px-4 py-2 rounded bg-white/20 text-white text-sm font-medium hover:bg-white/30"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="px-4 py-2 rounded bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white text-sm font-medium hover:from-[#1db954]/80 hover:to-[#1e90ff]/80"
                      onClick={() => setShowConnect(true)}
                    >
                      Connect UPI
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#1db954]" />
                Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Manage your notification preferences
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-[#1db954]" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Transaction alerts</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-[#1db954]" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Spending insights</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-[#1db954]" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Investment updates</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Privacy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Control your data and privacy settings
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-[#1db954]" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Share analytics data</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-[#1db954]" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Allow personalized ads</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Language & Region</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Set your preferred language and region
                  </p>
                  <select className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-white">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Danger Zone
            </h3>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Delete Account</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowEditProfile(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-6 h-6 text-[#1db954]" />
                Edit Profile
              </h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
              </label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
              </label>
                <input
                  type="tel"
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent"
                />
            </div>
              
              <div className="flex gap-3 pt-4">
            <button
              type="submit"
                  disabled={profileLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white rounded-lg font-medium hover:from-[#1db954]/90 hover:to-[#1e90ff]/90 transition-all disabled:opacity-50"
                >
                  {profileLoading ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
            </button>
              </div>
          </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowChangePassword(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="w-6 h-6 text-[#1db954]" />
                Change Password
              </h2>
              <button
                onClick={() => setShowChangePassword(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full p-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full p-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full p-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent"
                    required
                    minLength="6"
                  />
              <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white rounded-lg font-medium hover:from-[#1db954]/90 hover:to-[#1e90ff]/90 transition-all disabled:opacity-50"
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
          <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
                  Cancel
          </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
  );
};

export default Settings; 