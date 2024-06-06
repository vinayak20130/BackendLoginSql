const Otp = require("../models/otp");
const User = require("../models/User");
const crypto = require("crypto");
const transporter = require("../config/email");

// Generate OTP
exports.generateOtp = async (req, res) => {
  const { email } = req.body;

  // Ensure the email is associated with a registered user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Generate a random 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Save the OTP to the database
  const otpDoc = new Otp({ email, otp });
  await otpDoc.save();

  // Send the OTP via email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Error sending OTP email" });
    } else {
      console.log("Email sent: " + info.response);
      return res.status(201).json({
        message: "OTP generated and sent via email",
        status: "success",
      });
    }
  });
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const otpDoc = await Otp.findOne({ email, otp });

  if (!otpDoc) {
    return res.status(400).json({ message: "Invalid or expired OTP", status: 400  });
  }

  // OTP is valid
  res.status(200).json({ message: "OTP verified", status: 200 });

  // Optionally, delete the OTP after verification
  await Otp.deleteOne({ _id: otpDoc._id });
};
