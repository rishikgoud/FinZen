import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error in getUserProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    
    console.log('Received update request:', req.body);
    console.log('User ID:', req.user.id);
    
    // Prepare updates object with proper nesting
    const updates = {};
    
    if (firstName !== undefined) updates['profile.firstName'] = firstName;
    if (lastName !== undefined) updates['profile.lastName'] = lastName;
    if (phone !== undefined) updates['profile.phone'] = phone;
    if (email !== undefined) updates.email = email; // email is at root level
    
    console.log('Prepared updates object:', updates);
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log('Updated user:', user);
    res.json(user);
  } catch (err) {
    console.error("❌ Error in updateUserProfile:", err);
    console.error("Error details:", err.message);
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("❌ Error in changePassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};
