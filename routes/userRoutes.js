const express = require("express");
const { login, changePassword } = require("../controllers/userController");
const { generateOtp, verifyOtp } = require("../controllers/otpController");
const { generateOtpForExistingUsers , verifyOtpForExisting } = require("../controllers/otpControllerForExistingUsers");
const {
  createUser,
  editUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/CRUDUsers");

const router = express.Router();

// Login Route
router.post("/login", login);
router.post("/change-password", changePassword);

// CRUD User Routes
router.post("/createUser", createUser);
router.put("/editUser", editUser);
router.delete("/deleteUser/:id", deleteUser);
router.get("/getAllUsers", getAllUsers);

// OTP Routes
router.post("/sendOtp", generateOtp);
router.post("/checkOtp", verifyOtp);
router.post("/sendOtpForExisting", generateOtpForExistingUsers);
router.post("/checkOtpForExisting", verifyOtpForExisting);
module.exports = router;
