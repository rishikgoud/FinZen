// const API_BASE = import.meta.env.VITE_API_BASE
const API_BASE = "http://localhost:5000/api";

// GPay UPI Backend URL - Updated to deployed version
const GPAY_API_BASE = "https://gpay-upi-backend-finzen.onrender.com";

const HF_OPENAI_BASE = "https://router.huggingface.co/novita/v3/openai";
const HF_MODEL = "baidu/ernie-4.5-21B-a3b";

// 1. Fetch Profile
export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch user profile");
    return await res.json();
  } catch (err) {
    return null;
  }
};

// 2. Fetch Cards
export const fetchCardsOverview = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/cards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch cards overview");
    return await res.json();
  } catch (err) {
    return [];
  }
};

// 3. Fetch Insights
export const fetchInsights = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/insights`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Check if response is ok and has content
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    // Check if response has content
    const text = await res.text();
    if (!text) {
      return [];
    }
    
    // Try to parse JSON
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    logError(err, "fetchInsights");
    return [];
  }
};

// 4. Spending Breakdown
export const fetchSpendingBreakdown = async (filter = "month") => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/spending-breakdown?filter=${filter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch spending breakdown");
    return await res.json();
  } catch (err) {
    return [];
  }
};

// 5. Income Breakdown
export const fetchIncomeBreakdown = async (filter = "month") => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/income?filter=${filter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch income breakdown");
    return await res.json();
  } catch (err) {
    return [];
  }
};
//income vs expense

export const fetchIncomeVsExpense = async (filter = "month") => {
  try {
    const res = await fetch(`${API_BASE}/income-vs-expense?filter=${filter}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch income vs expense data");

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
};

// Transaction CRUD
export const fetchTransactions = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return await res.json();
  } catch (err) {
    return [];
  }
};

export const addTransaction = async (txn) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(txn),
    });
    if (!res.ok) throw new Error("Failed to add transaction");
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const editTransaction = async (id, txn) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(txn),
    });
    if (!res.ok) throw new Error("Failed to edit transaction");
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const deleteTransaction = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete transaction");
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const fetchSpendingCoachAdvice = async (transactions = null, followup = null) => {
  const token = localStorage.getItem("token");
  try {
    const body = followup
      ? JSON.stringify({ transactions, followup })
      : JSON.stringify(transactions ? { transactions } : {});
    const res = await fetch(`http://localhost:5000/api/spending-coach`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });
    if (!res.ok) throw new Error("Failed to fetch spending coach advice");
    const data = await res.json();
    return data;
  } catch (err) {
    return null;
  }
};

export const fetchPortfolio = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/portfolio`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch portfolio");
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const tradePortfolio = async (asset, amount) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/portfolio/trade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ asset, amount }),
    });
    if (!res.ok) throw new Error("Failed to execute trade");
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const fetchLoanEligibility = async (income, employment, creditScore) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({ income, employment, creditScore });
  try {
    const res = await fetch(`${API_BASE}/loan-eligibility?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch loan eligibility");
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const fetchGoalBooster = async (goal, current) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({ goal, current });
  try {
    const res = await fetch(`${API_BASE}/goal-booster?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch goal booster");
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const updateUserProfile = async (profile) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return await res.json();
  } catch (err) {
    return null;
  }
};

// Fetch connected GPay mock user details
export const fetchGPayUser = async () => {
  const gpayToken = localStorage.getItem('gpay_token');
  if (!gpayToken) return null;
  try {
    const res = await fetch(`${GPAY_API_BASE}/upi/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${gpayToken}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch GPay user');
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const fetchSpendingCoachAdviceHF = async (transactions = null, followup = null) => {
  try {
    const res = await fetch('http://localhost:5000/api/spending-coach-hf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions, followup }),
    });
    if (!res.ok) throw new Error('Failed to fetch advice');
    const data = await res.json();
    return data.tips;
  } catch (err) {
    return null;
  }
};

export const fetchGPayTransactions = async () => {
  const gpayToken = localStorage.getItem('gpay_token');
  if (!gpayToken) return [];
  try {
    const user = await fetchGPayUser();
    if (!user || !user.upiId) return [];
    const res = await fetch(`${GPAY_API_BASE}/upi/transactions/${user.upiId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${gpayToken}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch GPay transactions');
    return await res.json();
  } catch (err) {
    return [];
  }
};

export function normalizeGPayTransaction(txn) {
  let amt = txn.amount;
  if (typeof amt === 'string') {
    amt = amt.replace(/[^\d.-]/g, '');
    amt = Number(amt);
    if (/^-/.test(txn.amount)) amt = -Math.abs(amt);
    else if (/^\+/.test(txn.amount)) amt = Math.abs(amt);
  }
  let d = null;
  if (txn.date) {
    if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(txn.date)) {
      const [m, day, y] = txn.date.split('/').map(Number);
      d = new Date(y, m - 1, day);
    } else {
      d = new Date(txn.date);
    }
  }
  return { ...txn, amount: amt, _parsedDate: d };
}


export const sendOTP = async (mobile) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE.replace(/\/$/, '')}/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const verifyOTP = async (mobile, otp) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE.replace(/\/$/, '')}/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};