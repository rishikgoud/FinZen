import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token, auth denied" });

  try {
    // Check if it's a GPay mock token (format: mock_token_{upiId}_{timestamp})
    if (token.startsWith('mock_token_')) {
      const parts = token.split('_');
      if (parts.length >= 3) {
        const upiId = parts[2];
        req.user = { upiId, tokenType: 'gpay' };
        next();
        return;
      }
    }
    
    // Handle JWT tokens for main app
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, tokenType: 'jwt' };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;
