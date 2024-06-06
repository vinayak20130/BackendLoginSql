// const crypto = require("crypto");
// require("dotenv").config();

// const generateToken = (user) => {
//   const tokenPayload = `${user.name}:${user.role}`;
//   const secretKey = process.env.TOKEN_SECRET; // Store this secret key in your .env file

//   const hash = crypto
//     .createHmac("sha256", secretKey)
//     .update(tokenPayload)
//     .digest("hex");

//   const token = Buffer.from(`${tokenPayload}.${hash}`).toString("base64");
//   return token;
// };

// module.exports = { generateToken };
// const crypto = require("crypto");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const secretKey = process.env.TOKEN_SECRET; // Replace with your actual secret key
  const options = {
    algorithm: "HS256", // Using HMAC SHA-256 algorithm
    // expiresIn: '1h' // Token expiration time (optional)
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
};

module.exports = { generateToken };
// console.log(generateToken());
