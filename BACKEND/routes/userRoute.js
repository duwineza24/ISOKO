const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  logoutUser,
  // forgotPassword,
  // resetPassword
} = require("../controller/userController");
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);
module.exports = router;
