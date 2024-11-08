// middleware/auth.js
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).send("Access denied.");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Invalid token.");
    req.userId = decoded.id; // Store user ID from token
    req.userRole = decoded.role; // Store user role from token
    next();
  });
};
