const jwt = require("jsonwebtoken");
const User = require("../model/user");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid auth format" });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ message: "Invalid token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE CRASH:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
