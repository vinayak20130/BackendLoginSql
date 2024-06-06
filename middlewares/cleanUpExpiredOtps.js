const pool = require('../config/database'); // Adjust path as necessary
const { toMySQLFormat, getISTTime } = require("../middlewares/timeConversion");

const cleanUpExpiredOtps = async () => {
  const query = `DELETE FROM otps WHERE expires_at > NOW()`;
  
  try {
    const [results] = await pool.execute(query);
    const nowIST = getISTTime(new Date());
    console.log(`Expired OTPs cleaned up: ${results.affectedRows} at ${nowIST}`);
  } catch (err) {
    console.error('Error cleaning up expired OTPs:', err);
  }
};

module.exports = cleanUpExpiredOtps;
