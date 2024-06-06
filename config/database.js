const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  console.log("Attempting to connect to database");
  mongoose
    .connect(process.env.MONGODB_URI) // optional config
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));
};

module.exports = dbConnect;
