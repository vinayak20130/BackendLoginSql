
const { generateToken } = require("../middlewares/tokenMiddleware");
const bcrypt = require('bcrypt');
const pool = require("../config/database");

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  // console.log("Login request received:", { email, password });

  // Validate email and password
  if (!email || !password) {
    // console.log("Validation failed: Email and password are required.");
    return res.status(400).send("Email and password are required.");
  }

  try {
    // Find user by email
    const findUserQuery = `SELECT * FROM UserCredentials WHERE email = ? LIMIT 1`;
    const [users] = await pool.execute(findUserQuery, [email]);

    // console.log("User query result:", users);

    if (users.length === 0) {
      console.log("Invalid email:", email);
      return res.status(401).send("Invalid email.");
    }

    const user = users[0];

    // Check if user is blocked
    if (user.is_Blocked) {
      // console.log("User account is blocked:", email);
      return res.status(403).send("User account is blocked.");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    // console.log("Password match result:", isMatch);

    if (!isMatch) {
      // console.log("Invalid password for email:", email);
      return res.status(401).send("Invalid password.");
    }

    // Generate token
    const token = generateToken({
      id: user.user_id,
      email: user.email,
    });

    // console.log("Token generated:", token);

    // Respond with token
    res.status(200).send({
      data: {
        token,
      }
    });
  } catch (error) {
    console.error("Error logging in:", error);
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
    // Check if user exists in UserCredentials table
    const checkUserQuery = `SELECT * FROM UserCredentials WHERE email = ? LIMIT 1`;
    const [existingUser] = await pool.execute(checkUserQuery, [email]);

    if (existingUser.length === 0) {
      return res.status(404).send("User not found.");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password in the UserCredentials table
    const updatePasswordQuery = `UPDATE UserCredentials SET password_hash = ? WHERE email = ?`;
    await pool.execute(updatePasswordQuery, [hashedPassword, email]);

    // Respond with success message
    res.send({ message: "Password changed successfully." });
  } catch (error) {
    console.error(`Error changing password: ${error.message}`);
    res.status(500).send("Server error.");
  }
};


module.exports = { login, changePassword };
