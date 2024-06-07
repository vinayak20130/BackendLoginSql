const crypto = require("crypto");
const transporter = require("../config/email");
const pool = require("../config/database");
const { toMySQLFormat, getISTTime } = require("../middlewares/timeConversion");
require("dotenv").config();

exports.generateOtpForExistingUsers = async (req, res) => {
    const { email } = req.body;
  
    // Check if user exists in UserCredentials table
    const checkUserQuery = `SELECT * FROM UserCredentials WHERE email = ? LIMIT 1`;
  
    try {
      const [existingUser] = await pool.execute(checkUserQuery, [email]);
  
      if (existingUser.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate a random 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();
  
      // Set expiration time to 5 minutes from now in IST
      const expiresAt = toMySQLFormat(new Date(Date.now() + 5 * 60 * 1000));
      const createdAt = toMySQLFormat(new Date());
  
      // Save or update the OTP in the database
      const query = `
        INSERT INTO EmailVerifications (email, otp, created_at, expires_at)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at)
      `;
  
      await pool.execute(query, [email, otp, createdAt, expiresAt]);
  
      // Send the OTP via email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending OTP email:", error);
          return res.status(500).json({ message: "Error sending OTP email" });
        } else {
          console.log("Email sent:", info.response);
          return res.status(201).json({
            message: "OTP generated and sent via email",
            status: "success",
          });
        }
      });
    } catch (err) {
      console.error("Error generating OTP:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
  exports.verifyOtpForExisting = async (req, res) => {
    const { email, otp } = req.body;
  
    // Check if user exists in UserCredentials table
    const checkUserQuery = `SELECT * FROM UserCredentials WHERE email = ? LIMIT 1`;
  
    try {
      const [existingUser] = await pool.execute(checkUserQuery, [email]);
  
      if (existingUser.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const selectQuery = `SELECT * FROM EmailVerifications WHERE email = ? AND otp = ? AND expires_at > NOW() LIMIT 1`;
      const deleteQuery = `DELETE FROM EmailVerifications WHERE email = ? AND otp = ?`;
  
      const [results] = await pool.execute(selectQuery, [email, otp]);
  
      if (results.length > 0) {
        // If OTP is verified, delete the entry
        await pool.execute(deleteQuery, [email, otp]);
        return res.status(200).json({ message: "OTP verified and entry deleted successfully" });
      } else {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      return res.status(500).json({ message: "Error verifying OTP" });
    }
  };