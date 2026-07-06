// Example validation inside middleware/auth.middleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach payload (email, role) to the request object
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalid" });
  }
};
