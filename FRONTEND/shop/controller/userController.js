const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "3d" });
};
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashPassword, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(401).json({ message: "User does not exist" });
    }
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = generateToken(findUser._id);

    return res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        _id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};



module.exports = { createUser, loginUser, logoutUser };
