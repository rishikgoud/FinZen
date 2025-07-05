import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Finzen integration fields
    userId: { type: String, unique: true, sparse: true }, // For GPay mock API integration
    upiId: { type: String, unique: true, sparse: true }, // UPI ID for cross-platform sync

    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      phone: String,
      occupation: String,
      income: Number
    },

    preferences: {
      upiApps: [String],
      primaryUPI: String,
      darkMode: { type: Boolean, default: false }
    },

    goals: {
      savingsTarget: Number,
      investmentTarget: Number,
      monthlyBudget: Number,
      shortTerm: String,
      longTerm: String
    },

    spendingCategories: {
      prioritized: [String],
      avoid: [String]
    },

    onboardingCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
