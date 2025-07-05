import Transaction from "../models/Transaction.js";

export const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's transactions from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    if (!transactions || transactions.length === 0) {
      // Return default insights for new users
      return res.json([
        {
          title: "Welcome to FinZen!",
          amount: "₹0",
          type: "welcome",
          description: "Start adding transactions to get personalized insights"
        },
        {
          title: "Set Your First Goal",
          amount: "₹5,000",
          type: "goal",
          description: "Create a savings goal to track your progress"
        },
        {
          title: "Connect Your UPI",
          amount: "Auto-sync",
          type: "connect",
          description: "Link your UPI for automatic transaction tracking"
        }
      ]);
    }

    // Analyze spending patterns
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    
    // Category analysis
    const categorySpending = {};
    expenses.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });
    
    const topCategories = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    // Recent spending trend (last 7 days vs previous 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    const recentExpenses = expenses.filter(t => t.date >= sevenDaysAgo);
    const previousExpenses = expenses.filter(t => 
      t.date >= fourteenDaysAgo && t.date < sevenDaysAgo
    );
    
    const recentTotal = recentExpenses.reduce((sum, t) => sum + t.amount, 0);
    const previousTotal = previousExpenses.reduce((sum, t) => sum + t.amount, 0);
    const spendingChange = previousTotal > 0 ? ((recentTotal - previousTotal) / previousTotal) * 100 : 0;
    
    // Generate dynamic insights
    const insights = [];
    
    // 1. Spending Overview
    if (totalExpenses > 0) {
      insights.push({
        title: "Monthly Spending",
        amount: `₹${totalExpenses.toLocaleString()}`,
        type: "spending",
        description: `${spendingChange > 0 ? '+' : ''}${spendingChange.toFixed(1)}% from last week`,
        trend: spendingChange > 0 ? "up" : "down"
      });
    }
    
    // 2. Savings Insight
    if (netSavings > 0) {
      insights.push({
        title: "Net Savings",
        amount: `₹${netSavings.toLocaleString()}`,
        type: "savings",
        description: `${((netSavings / totalIncome) * 100).toFixed(1)}% of income saved`,
        trend: "positive"
      });
    } else if (netSavings < 0) {
      insights.push({
        title: "Overspending Alert",
        amount: `₹${Math.abs(netSavings).toLocaleString()}`,
        type: "alert",
        description: "You're spending more than you earn",
        trend: "negative"
      });
    }
    
    // 3. Top Spending Category
    if (topCategories.length > 0) {
      const [topCategory, topAmount] = topCategories[0];
      insights.push({
        title: `Top: ${topCategory}`,
        amount: `₹${topAmount.toLocaleString()}`,
        type: "category",
        description: `${((topAmount / totalExpenses) * 100).toFixed(1)}% of total spending`,
        trend: "neutral"
      });
    }
    
    // 4. Income Analysis
    if (totalIncome > 0) {
      const avgDailyIncome = totalIncome / 30;
      insights.push({
        title: "Daily Income Avg",
        amount: `₹${avgDailyIncome.toFixed(0)}`,
        type: "income",
        description: "Based on last 30 days",
        trend: "positive"
      });
    }
    
    // 5. Spending Efficiency
    if (totalExpenses > 0 && totalIncome > 0) {
      const efficiency = ((totalIncome - totalExpenses) / totalIncome) * 100;
      if (efficiency > 20) {
        insights.push({
          title: "Great Savings Rate!",
          amount: `${efficiency.toFixed(1)}%`,
          type: "achievement",
          description: "You're saving more than 20% of income",
          trend: "positive"
        });
      } else if (efficiency < 10) {
        insights.push({
          title: "Low Savings Rate",
          amount: `${efficiency.toFixed(1)}%`,
          type: "warning",
          description: "Try to save at least 10% of income",
          trend: "negative"
        });
      }
    }
    
    // 6. Category Optimization
    if (topCategories.length > 1) {
      const [secondCategory, secondAmount] = topCategories[1];
      const potentialSavings = secondAmount * 0.1; // 10% reduction
      insights.push({
        title: `Save on ${secondCategory}`,
        amount: `₹${potentialSavings.toFixed(0)}`,
        type: "optimization",
        description: "10% reduction potential",
        trend: "positive"
      });
    }
    
    // 7. Transaction Frequency
    const avgTransactionsPerDay = transactions.length / 30;
    if (avgTransactionsPerDay > 3) {
      insights.push({
        title: "High Transaction Rate",
        amount: `${avgTransactionsPerDay.toFixed(1)}/day`,
        type: "frequency",
        description: "Consider batch purchases",
        trend: "neutral"
      });
    }
    
    // 8. Weekend vs Weekday Spending
    const weekendTransactions = expenses.filter(t => {
      const day = new Date(t.date).getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    });
    const weekdayTransactions = expenses.filter(t => {
      const day = new Date(t.date).getDay();
      return day !== 0 && day !== 6;
    });
    
    const weekendTotal = weekendTransactions.reduce((sum, t) => sum + t.amount, 0);
    const weekdayTotal = weekdayTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    if (weekendTotal > weekdayTotal * 1.5) {
      insights.push({
        title: "Weekend Spending High",
        amount: `₹${weekendTotal.toLocaleString()}`,
        type: "pattern",
        description: "50% more than weekday spending",
        trend: "negative"
      });
    }
    
    // Return top 6 most relevant insights
    return res.json(insights.slice(0, 6));
    
  } catch (err) {
    console.error("Error fetching insights:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSpendingCoachAdvice = async (req, res) => {
  try {
    // Mock analysis of recent transactions
    const mockTransactions = [
      { category: "Food", amount: 3200 },
      { category: "Transport", amount: 1200 },
      { category: "Entertainment", amount: 1800 },
      { category: "Bills", amount: 2500 },
      { category: "Shopping", amount: 2200 },
    ];
    // Calculate totals
    const total = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
    const topCategories = mockTransactions
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
    // Generate advice
    const tips = [
      `Your top spending categories this month are: ${topCategories
        .map((c) => c.category + " (₹" + c.amount + ")")
        .join(", ")}.`,
      `You spent a total of ₹${total} this month.`,
      `Try reducing your ${topCategories[0].category.toLowerCase()} expenses by 10% to save ₹${Math.round(
        topCategories[0].amount * 0.1
      )} next month.`,
      "Set a weekly budget and track your progress for better savings.",
    ];
    res.json({
      breakdown: topCategories,
      total,
      tips,
    });
  } catch (err) {
    console.error("Error in Spending Coach:", err);
    res.status(500).json({ message: "Server error" });
  }
};

let mockPortfolio = {
  holdings: [
    { asset: "Mutual Fund A", value: 12000, gain: 8 },
    { asset: "ETF B", value: 8000, gain: 5 },
    { asset: "Stock C", value: 5000, gain: -2 },
  ],
  totalValue: 25000,
  lastTrade: null,
};

export const getPortfolio = async (req, res) => {
  try {
    res.json(mockPortfolio);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const tradePortfolio = async (req, res) => {
  try {
    const { asset, amount } = req.body;
    // Find or add asset
    let found = false;
    mockPortfolio.holdings = mockPortfolio.holdings.map((h) => {
      if (h.asset === asset) {
        found = true;
        return { ...h, value: h.value + Number(amount) };
      }
      return h;
    });
    if (!found) {
      mockPortfolio.holdings.push({ asset, value: Number(amount), gain: 0 });
    }
    mockPortfolio.totalValue += Number(amount);
    mockPortfolio.lastTrade = { asset, amount, date: new Date().toISOString() };
    res.json({ success: true, message: `Invested ₹${amount} in ${asset}.`, portfolio: mockPortfolio });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getLoanEligibility = async (req, res) => {
  try {
    // Accept data from query or body for flexibility
    const income = Number(req.query.income || req.body.income || 0);
    const employment = (req.query.employment || req.body.employment || "").toLowerCase();
    const creditScore = Number(req.query.creditScore || req.body.creditScore || 0);

    let eligible = false;
    let reason = "";
    let maxLoan = 0;

    if (income >= 30000 && creditScore >= 700 && employment === "salaried") {
      eligible = true;
      maxLoan = income * 20;
      reason = `Eligible for up to ₹${maxLoan} loan.`;
    } else if (income >= 20000 && creditScore >= 650) {
      eligible = true;
      maxLoan = income * 10;
      reason = `Eligible for up to ₹${maxLoan} loan. Improve credit score for better offers.`;
    } else {
      reason = "Not eligible. Increase income or credit score, or check employment type.";
    }

    res.json({ eligible, maxLoan, reason, input: { income, employment, creditScore } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getGoalBooster = async (req, res) => {
  try {
    const goal = Number(req.query.goal || req.body.goal || 20000);
    const current = Number(req.query.current || req.body.current || 8000);
    const weeklySave = 1500; // mock
    const weeksLeft = Math.ceil((goal - current) / weeklySave);
    const plan = `If you save ₹${weeklySave} per week, you'll reach your goal in ${weeksLeft} weeks.`;
    const challenges = [
      "No coffee week: Save ₹300",
      "Cook at home challenge: Save ₹500",
      "Round-up savings: Every transaction rounds up to the next ₹100, auto-saved."
    ];
    res.json({
      goal,
      current,
      plan,
      challenges,
      progress: Math.min(100, Math.round((current / goal) * 100)),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
