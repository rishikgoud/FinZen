import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: String,
    date: {
      type: Date,
      default: Date.now,
    },
    paymentId: {
      type: String,
      required: true,
      index: true,
    },
    // Finzen integration fields
    senderUpi: String, // UPI ID of sender
    receiverUpi: String, // UPI ID of receiver
    source: {
      type: String,
      enum: ["finzen", "gpay_mock", "manual"],
      default: "manual"
    }
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
