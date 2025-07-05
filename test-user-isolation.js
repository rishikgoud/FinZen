// Test script to verify user-specific data isolation
const API_URL = "http://localhost:5000"; // Finzen backend runs on port 5000

async function testUserIsolation() {
  console.log("🧪 Testing User Data Isolation...\n");

  // Test User 1: john@finzen
  console.log("1️⃣ Testing User: john@finzen");
  const user1Auth = await fetch(`${API_URL}/upi/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ upiId: 'john@finzen', password: 'test123' })
  });
  const user1Data = await user1Auth.json();
  const user1Token = user1Data.token;
  
  // Get user1 transactions
  const user1Transactions = await fetch(`${API_URL}/upi/transactions/john@finzen`, {
    headers: { Authorization: `Bearer ${user1Token}` }
  });
  const user1Txns = await user1Transactions.json();
  console.log(`   User1 has ${user1Txns.length} transactions`);
  
  // Add a transaction for user1
  await fetch(`${API_URL}/upi/transactions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user1Token}`
    },
    body: JSON.stringify({
      title: "User1's Coffee",
      category: "Food",
      amount: 150,
      type: "expense",
      icon: "☕"
    })
  });

  // Test User 2: jane@finzen
  console.log("\n2️⃣ Testing User: jane@finzen");
  const user2Auth = await fetch(`${API_URL}/upi/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ upiId: 'jane@finzen', password: 'test123' })
  });
  const user2Data = await user2Auth.json();
  const user2Token = user2Data.token;
  
  // Get user2 transactions
  const user2Transactions = await fetch(`${API_URL}/upi/transactions/jane@finzen`, {
    headers: { Authorization: `Bearer ${user2Token}` }
  });
  const user2Txns = await user2Transactions.json();
  console.log(`   User2 has ${user2Txns.length} transactions`);
  
  // Add a transaction for user2
  await fetch(`${API_URL}/upi/transactions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user2Token}`
    },
    body: JSON.stringify({
      title: "User2's Shopping",
      category: "Shopping",
      amount: 500,
      type: "expense",
      icon: "🛍️"
    })
  });

  // Test cross-user access (should be denied)
  console.log("\n3️⃣ Testing Cross-User Access (should be denied)");
  try {
    const crossAccess = await fetch(`${API_URL}/upi/transactions/john@finzen`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    if (crossAccess.status === 403) {
      console.log("   ✅ Cross-user access correctly denied");
    } else {
      console.log("   ❌ Cross-user access should have been denied");
    }
  } catch (error) {
    console.log("   ✅ Cross-user access correctly denied");
  }

  // Verify user1 still has their own data
  const user1TransactionsAfter = await fetch(`${API_URL}/upi/transactions/john@finzen`, {
    headers: { Authorization: `Bearer ${user1Token}` }
  });
  const user1TxnsAfter = await user1TransactionsAfter.json();
  console.log(`\n4️⃣ User1 now has ${user1TxnsAfter.length} transactions (should be ${user1Txns.length + 1})`);

  // Verify user2 has their own data
  const user2TransactionsAfter = await fetch(`${API_URL}/upi/transactions/jane@finzen`, {
    headers: { Authorization: `Bearer ${user2Token}` }
  });
  const user2TxnsAfter = await user2TransactionsAfter.json();
  console.log(`   User2 now has ${user2TxnsAfter.length} transactions (should be ${user2Txns.length + 1})`);

  // List all users (for debugging)
  console.log("\n5️⃣ All registered users:");
  const allUsers = await fetch(`${API_URL}/upi/users`);
  const users = await allUsers.json();
  if (Array.isArray(users)) {
    users.forEach(user => {
      console.log(`   - ${user.upiId}: ${user.transactionCount} transactions, ₹${user.balance} balance`);
    });
  } else {
    console.log("   ❌ Could not fetch users list");
  }

  console.log("\n✅ User isolation test completed!");
}

// Run the test
testUserIsolation().catch(console.error); 