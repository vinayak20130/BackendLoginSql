const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");  // Import the CORS module
const cleanUpExpiredOtps = require('./middlewares/cleanUpExpiredOtps');
setInterval(cleanUpExpiredOtps, 3000 * 1000);
// const cleanUpExpiredOtps = require("./middlewares/cleanExpiredOtps")
// const cleanUpExpiredOtps = require('./middlewares/cleanUpExpiredOtps');
// Connect to MongoDB
// Create an Express app
const app = express();
// setInterval(cleanUpExpiredOtps, 60 * 1000);
// Enable CORS for all routes and origins
app.use(cors());
// setInterval(cleanUpExpiredOtps, 60 * 1000);

// Alternatively, to enable CORS only for specific origin:
// app.use(cors({
//     origin: 'http://localhost:3000'  // Frontend origin
// }));

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Route imports
const userRoutes = require("./routes/userRoutes");
const dataRoutes = require("./routes/dataRoute");

// API routes
app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes);

// Define a simple route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
