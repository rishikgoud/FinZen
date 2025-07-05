import React, { createContext, useContext, useEffect, useState } from "react";
import { io as socketIOClient } from "socket.io-client";

const GPayUserContext = createContext();
const Gpay_API_URL = "http://localhost:3000";

export const GPayUserProvider = ({ children }) => {
  const [gpayUser, setGpayUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const gpayToken = localStorage.getItem("gpay_token");

  const fetchUserAndTransactions = async () => {
    if (!gpayToken) return;
    
    const res = await fetch(`${Gpay_API_URL}/upi/me`, {
      headers: { Authorization: `Bearer ${gpayToken}` },
    });
    if (res.ok) {
      const user = await res.json();
      setGpayUser(user);
      const upiId = user.upiId;
      // Fetch transactions for this user
      if (upiId) {
        const txnRes = await fetch(`${Gpay_API_URL}/upi/transactions/${upiId}`, {
          headers: { Authorization: `Bearer ${gpayToken}` },
        });
        if (txnRes.ok) {
          const txns = await txnRes.json();
          setTransactions(txns);
        } else {
          setTransactions([]);
        }
      }
    } else {
      setGpayUser(null);
      setTransactions([]);
    }
  };

  const refreshTransactions = async () => {
    await fetchUserAndTransactions();
  };

  const refreshData = async () => {
    await fetchUserAndTransactions();
  };

  useEffect(() => {
    let socket;
    let upiId = null;
    
    const setupData = async () => {
      await fetchUserAndTransactions();
      if (gpayUser) {
        upiId = gpayUser.upiId;
      }
    };

    setupData();

    // Setup socket for real-time updates
    if (gpayToken) {
      socket = socketIOClient(Gpay_API_URL, {
        auth: { token: gpayToken },
      });
      socket.on("transaction:new", (txn) => {
        // Only update if the transaction is for this user
        if (txn.senderUpiId === upiId || txn.receiverUpiId === upiId) {
          setTransactions((prev) => [txn, ...prev]);
          // Optionally update balance
          setGpayUser((prevUser) => {
            if (!prevUser) return prevUser;
            let newBalance = prevUser.balance;
            if (txn.receiverUpiId === upiId && txn.type === "income") {
              newBalance += txn.amount;
            } else if (txn.senderUpiId === upiId && txn.type === "expense") {
              newBalance -= txn.amount;
            }
            return { ...prevUser, balance: newBalance };
          });
        }
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [gpayToken]);

  return (
    <GPayUserContext.Provider value={{ gpayUser, transactions, refreshTransactions, refreshData }}>
      {children}
    </GPayUserContext.Provider>
  );
};

export const useGPayUser = () => useContext(GPayUserContext); 