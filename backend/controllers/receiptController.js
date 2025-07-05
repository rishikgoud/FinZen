import axios from 'axios';
import fs from 'fs';
import path from 'path';

// You should store these securely (e.g., in environment variables)
const VERYFI_CLIENT_ID = process.env.VERYFI_CLIENT_ID || 'YOUR_CLIENT_ID';
const VERYFI_USERNAME = process.env.VERYFI_USERNAME || 'YOUR_USERNAME';
const VERYFI_API_KEY = process.env.VERYFI_API_KEY || 'YOUR_API_KEY';

console.log('Veryfi creds:', process.env.VERYFI_CLIENT_ID, process.env.VERYFI_USERNAME, process.env.VERYFI_API_KEY);

// POST /api/receipt/ocr
export async function processReceipt(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath, { encoding: 'base64' });

    const response = await axios.post(
      'https://api.veryfi.com/api/v7/partner/documents/',
      {
        file_data: fileData,
        file_name: path.basename(filePath),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'CLIENT-ID': VERYFI_CLIENT_ID,
          'AUTHORIZATION': `apikey ${VERYFI_USERNAME}:${VERYFI_API_KEY}`,
        },
      }
    );

    // Optionally delete the file after processing
    fs.unlinkSync(filePath);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Clean and simple receipt parsing function
export function parseReceiptText(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  // 1. Extract merchant name (first few lines)
  const merchant = lines.slice(0, 3).join(' ');
  
  // 2. Extract date
  const date = extractDate(text);
  
  // 3. Extract total amount (main focus)
  const amount = extractTotalAmount(text);
  
  // 4. Detect category
  const category = detectCategory(text);
  
  return { merchant, date, amount, category };
}

// Extract total amount with focus on grand total
function extractTotalAmount(text) {
  const lines = text.toLowerCase().split('\n');
  
  // Keywords that indicate total amounts
  const totalKeywords = [
    'total amount',
    'grand total', 
    'final total',
    'amount due',
    'total due',
    'food total',
    'sub total',
    'subtotal',
    'total :',
    'total:',
    'amount :',
    'amount:',
    'net amount',
    'payable amount',
    'final amount'
  ];
  
  // Keywords that indicate individual items (to skip)
  const itemKeywords = [
    'item', 'qty', 'rate', 'amt', 'quantity', 'price', 'unit',
    'broccoli', 'crispy', 'zarina', 'roti', 'brownie', 'food',
    'service', 'tax', 'gst', 'vat', 'cst', 'tin', 'medu', 'wada'
  ];
  
  let bestAmount = '';
  let bestAmountValue = 0;
  
  // Search from bottom to top (totals are usually at bottom)
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    
    // Skip lines with tax-related content or item details
    if (line.includes('tin') || line.includes('gst') || line.includes('vat') || line.includes('cst') ||
        line.includes('item') || line.includes('qty') || line.includes('rate') || line.includes('amt') ||
        line.includes('ph') || line.includes('phone') || line.includes('tel') || // Skip phone numbers
        itemKeywords.some(keyword => line.includes(keyword))) {
      continue;
    }
    
    // Check if line contains total keywords
    const hasTotalKeyword = totalKeywords.some(keyword => line.includes(keyword));
    
    if (hasTotalKeyword) {
      // Look for decimal amounts first (e.g., 70.88) - more specific pattern
      const decimalMatch = line.match(/(\d{1,4}[.,]\d{2})/);
      if (decimalMatch) {
        const amount = parseFloat(decimalMatch[1].replace(/[,.]/g, ''));
        if (amount >= 10 && amount <= 50000 && amount > bestAmountValue) {
          bestAmount = amount.toString();
          bestAmountValue = amount;
        }
      }
      
      // Look for whole numbers (e.g., 7088) - but be more careful about phone numbers
      const wholeMatch = line.match(/(\d{1,4})/);
      if (wholeMatch) {
        const amount = parseFloat(wholeMatch[1]);
        // More restrictive range to avoid phone numbers
        if (amount >= 10 && amount <= 10000 && amount > bestAmountValue) {
          bestAmount = amount.toString();
          bestAmountValue = amount;
        }
      }
    }
  }
  
  // If still no amount found, look for the largest reasonable number in the last few lines
  if (!bestAmount) {
    const lastLines = lines.slice(-8); // Last 8 lines
    
    for (const line of lastLines) {
      // Skip lines with item details, tax info, or phone numbers
      if (line.includes('tin') || line.includes('gst') || line.includes('vat') || line.includes('cst') ||
          line.includes('item') || line.includes('qty') || line.includes('rate') || line.includes('amt') ||
          line.includes('service') || line.includes('tax') ||
          line.includes('ph') || line.includes('phone') || line.includes('tel') ||
          itemKeywords.some(keyword => line.includes(keyword))) {
        continue;
      }
      
      // Look for decimal amounts
      const decimalMatches = line.match(/(\d{1,4}[.,]\d{2})/g);
      if (decimalMatches) {
        for (const match of decimalMatches) {
          const amount = parseFloat(match.replace(/[,.]/g, ''));
          if (amount >= 10 && amount <= 50000 && amount > bestAmountValue) {
            bestAmount = amount.toString();
            bestAmountValue = amount;
          }
        }
      }
      
      // Look for whole numbers (more restrictive)
      const wholeMatches = line.match(/(\d{1,4})/g);
      if (wholeMatches) {
        for (const match of wholeMatches) {
          const amount = parseFloat(match);
          // More restrictive range to avoid phone numbers
          if (amount >= 10 && amount <= 10000 && amount > bestAmountValue) {
            bestAmount = amount.toString();
            bestAmountValue = amount;
          }
        }
      }
    }
  }
  
  return bestAmount;
}

// Extract date from receipt
function extractDate(text) {
  const datePatterns = [
    /(\d{1,2}[\/\-.\s]\d{1,2}[\/\-.\s]\d{2,4})/g,
    /(\d{4}[\/\-.\s]\d{1,2}[\/\-.\s]\d{1,2})/g
  ];
  
  for (const pattern of datePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      return matches[matches.length - 1]; // Return last date found
    }
  }
  
  return '';
}

// Detect category based on keywords
function detectCategory(text) {
  const lower = text.toLowerCase();
  
  if (/(food|restaurant|cafe|pizza|burger|meal|dine|coffee|snack|hotel|menu|lunch|dinner|breakfast|beverage|juice|bar|bakery|sweets|ice cream)/.test(lower)) {
    return "Food & Dining";
  }
  if (/(electricity|power|energy|current|bill)/.test(lower)) {
    return "Electricity";
  }
  if (/(gas|lpg|cylinder|petrol|diesel|fuel|pump)/.test(lower)) {
    return "Gas/Fuel";
  }
  if (/(grocery|supermarket|mart|store|provision|vegetable|fruit|kirana)/.test(lower)) {
    return "Groceries";
  }
  if (/(pharmacy|medicine|hospital|clinic|doctor|health|medical|chemist)/.test(lower)) {
    return "Health";
  }
  if (/(mobile|recharge|internet|data|broadband|wifi|airtel|jio|vodafone|bsnl)/.test(lower)) {
    return "Mobile/Internet";
  }
  if (/(travel|taxi|uber|ola|bus|train|flight|ticket|cab|auto|transport)/.test(lower)) {
    return "Travel/Transport";
  }
  if (/(clothes|apparel|fashion|footwear|shirt|pant|jeans|dress|shopping|boutique)/.test(lower)) {
    return "Shopping";
  }
  
  return "Other";
}

// POST /api/transactions/parse-receipt
export async function parseReceipt(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });
    
    const result = parseReceiptText(text);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 