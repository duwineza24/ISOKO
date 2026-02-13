const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
 role: {
      type: String,
      enum: ["customer", "seller", "admin"], // 👈 added admin
      default: "customer", // 👈 default role
    },
});
module.exports = mongoose.model("users", userSchema);
