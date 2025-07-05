import express from 'express';
import { InferenceClient } from '@huggingface/inference';

const router = express.Router();
// Use environment variable for Hugging Face token
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
const client = new InferenceClient(HF_TOKEN);

router.post('/', async (req, res) => {
  const { transactions, mood, userQuery, goal, budgets, streak, ageGroup, lifestyle, model } = req.body;

  // Summarize recent transactions
  const recentTxns = (transactions || []).slice(-5).map(txn =>
    `${txn.date?.slice(0,10)}: ${txn.type} of ₹${txn.amount} for ${txn.category || 'misc'}`
  ).join('; ');

  // Find top spending category
  const categoryTotals = {};
  (transactions || []).forEach(txn => {
    if (txn.type === 'expense') {
      categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
    }
  });
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Build a rich prompt
  const promptVariants = [
    `You are a friendly, motivational financial coach.`,
    `You are a supportive friend who gives creative money-saving advice.`,
    `You are a gamified spending coach who loves giving new, actionable tips.`,
    `You are a positive, encouraging financial buddy.`,
  ];
  const intro = promptVariants[Math.floor(Math.random() * promptVariants.length)];

  let inputText = `${intro}`;
  if (ageGroup) inputText += ` The user is in the ${ageGroup} age group.`;
  if (lifestyle) inputText += ` Lifestyle: ${lifestyle}.`;
  if (goal) inputText += ` The user's goal is: ${goal}.`;
  if (budgets) inputText += ` Budgets: ${JSON.stringify(budgets)}.`;
  if (streak) inputText += ` The user is on a ${streak}-day savings streak.`;
  if (mood) inputText += ` The user is feeling: ${mood}.`;
  if (userQuery) inputText += ` ${userQuery}`;
  inputText += ` Recent transactions: ${recentTxns || 'None'}.`;
  if (topCategory) inputText += ` The top spending category is: ${topCategory}.`;
  inputText += ` Give a short, actionable, and personalized tip that is different from previous tips. Also, add a fun challenge or fact related to saving money. Do not repeat yourself.`;

  // Model selection
  let selectedModel = 'Menlo/Jan-nano-128k';
  if (model === 'summarizer') selectedModel = 'facebook/bart-large-cnn';
  if (model === 'jan-nano' || model === 'chat' || model === 'Menlo/Jan-nano-128k') selectedModel = 'Menlo/Jan-nano-128k';

  try {
    let result;
    if (selectedModel === 'facebook/bart-large-cnn') {
      result = await client.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: inputText,
        parameters: { max_new_tokens: 120 }
      });
      res.json({ message: result.summary_text, model: 'facebook/bart-large-cnn' });
    } else {
      // Use Jan-nano-128k as the default chat/instruction model with chatCompletion
      result = await client.chatCompletion({
        provider: 'featherless-ai',
        model: 'Menlo/Jan-nano-128k',
        messages: [
          {
            role: 'user',
            content: inputText,
          },
        ],
      });
      res.json({ message: result.choices[0].message.content, model: 'Menlo/Jan-nano-128k' });
    }
  } catch (err) {
    console.error('[AI Spending Insight] Error:', err);
    res.status(500).json({ message: "AI advice unavailable." });
  }
});

export default router; 