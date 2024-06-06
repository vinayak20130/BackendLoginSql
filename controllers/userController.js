const User = require("../models/User");
const { generateToken } = require("../middlewares/tokenMiddleware");
const bcrypt = require('bcrypt');

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email.");
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send("Invalid password.");
    }

    // Generate token
    const token = generateToken({
      id: user._id,
      name: user.name,
      role: user.role,
    });

    // Respond with token
    res.send({
      status: 200,
      data: {
        token,
      }
    });
  } catch (error) {
    res.status(500).send("Server error.");
  }
};


const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate email and newPassword
  if (!email || !newPassword) {
    return res.status(400).send("Email and new password are required.");
  }

  try {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Find user by email and update the password
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Respond with success message
    res.send({ message: "Password changed successfully." });
  } catch (error) {
    console.error(`Error changing password: ${error.message}`);
    res.status(500).send("Server error.");
  }
};


module.exports = { login, changePassword };
