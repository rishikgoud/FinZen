import React, { useState } from 'react';
import { X, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGPayUser } from '../../context/GPayUserContext';
import { logError } from '../../utils/logger';

const AddTransactionModal = ({ isOpen, onClose, onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Other',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'expense',
    icon: '💸'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { refreshData } = useGPayUser();
  
  // Use the GPay mock API URL (port 5000)
  const API_URL = "http://localhost:5000";

  const categories = [
    { name: 'Food', icon: '🍔' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Bills', icon: '📱' },
    { name: 'Entertainment', icon: '🎬' },
    { name: 'Healthcare', icon: '🏥' },
    { name: 'Education', icon: '📚' },
    { name: 'Income', icon: '💼' },
    { name: 'Other', icon: '💸' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    const selectedCategory = categories.find(cat => cat.name === category);
    setFormData(prev => ({
      ...prev,
      category,
      icon: selectedCategory ? selectedCategory.icon : '💸'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Add transaction to GPay mock API (deployed version)
      const response = await fetch(`https://gpay-upi-backend-finzen.onrender.com/upi/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('gpay_token')}`
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          amount: Math.abs(Number(formData.amount)),
          date: formData.date,
          type: formData.type,
          icon: formData.icon
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      const newTransaction = await response.json();
      
      toast.success('Transaction added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        category: 'Other',
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        type: 'expense',
        icon: '💸'
      });
      
      // Refresh data and close modal
      await refreshData();
      onTransactionAdded?.(newTransaction);
      onClose();
      
    } catch (error) {
      logError(error, "AddTransactionModal");
      toast.error('Failed to add transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0a0f1c]/95 backdrop-blur-sm rounded-2xl shadow-lg w-full max-w-md mx-auto border border-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
            Add Transaction
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Transaction Type */}
            <div>
              <label className="block text-gray-200 font-semibold mb-2 text-sm md:text-base">Transaction Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                  className={`flex-1 py-2 px-3 md:px-4 rounded-lg font-semibold transition-all text-sm md:text-base ${
                    formData.type === 'expense'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:text-white'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                  className={`flex-1 py-2 px-3 md:px-4 rounded-lg font-semibold transition-all text-sm md:text-base ${
                    formData.type === 'income'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:text-white'
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-gray-200 font-semibold mb-2 text-sm md:text-base">
                <FileText className="w-4 h-4" />
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none border border-gray-700 focus:border-[#1db954] text-sm md:text-base"
                placeholder="e.g., Grocery shopping, Salary, etc."
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="flex items-center gap-2 text-gray-200 font-semibold mb-2 text-sm md:text-base">
                <DollarSign className="w-4 h-4" />
                Amount (₹) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none border border-gray-700 focus:border-[#1db954] text-sm md:text-base"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-gray-200 font-semibold mb-2 text-sm md:text-base">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-gray-900/50 text-white focus:outline-none border border-gray-700 focus:border-[#1db954] text-sm md:text-base"
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-gray-200 font-semibold mb-2 text-sm md:text-base">
                <Calendar className="w-4 h-4" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl bg-gray-900/50 text-white focus:outline-none border border-gray-700 focus:border-[#1db954] text-sm md:text-base"
              />
            </div>
          </form>
        </div>

        {/* Footer with Buttons */}
        <div className="flex gap-2 p-6 border-t border-gray-800 flex-shrink-0">
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="flex-1 py-2 md:py-3 text-white rounded-lg font-semibold bg-gradient-to-r from-[#1db954] to-[#1e90ff] hover:from-[#1db954] hover:to-[#1e90ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm md:text-base"
          >
            {isLoading ? 'Adding...' : 'Add Transaction'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 md:py-3 rounded-lg font-semibold bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition-all text-sm md:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal; 