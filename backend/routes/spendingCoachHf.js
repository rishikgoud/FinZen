import express from 'express';
import { InferenceClient } from '@huggingface/inference';

const router = express.Router();

const HF_TOKEN = process.env.HF_TOKEN;
if (!HF_TOKEN) {
  console.error("[SpendingCoachHf] HF_TOKEN is not set in environment variables.");
}
const client = new InferenceClient(HF_TOKEN);

router.post('/', async (req, res) => {
  const { transactions, followup } = req.body;
  let prompt = "You are a personal spending coach. Analyze the user's recent transactions and provide actionable, friendly financial advice.\n";
  if (transactions && Array.isArray(transactions)) {
    prompt += "Transactions: " + transactions.map(t => `${t.title}: ₹${t.amount}`).join(", ") + "\n";
  }
  if (followup) {
    prompt += `User follow-up: ${followup}\n`;
  }
  prompt += "Tips:";

  try {
    const chatCompletion = await client.chatCompletion({
      provider: "novita",
      model: "baidu/ERNIE-4.5-21B-A3B-PT",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    res.json({ tips: chatCompletion.choices[0].message.content });
  } catch (err) {
    console.error("[SpendingCoachHf] Hugging Face Spending Coach Error:", err);
    res.status(500).json({ error: "Failed to fetch advice", details: err.message });
  }
});

export default router;