const User = require("../models/User");
const pool = require("../config/database");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const {
    email,
    password,
    full_name,
    profession,
    company,
    country,
    newsletter_opt_in,
    blocked,
  } = req.body;

  try {
    // Check if user already exists
    const checkUserQuery = `SELECT * FROM UserCredentials WHERE email = ?`;
    const [existingUser] = await pool.execute(checkUserQuery, [email]);

    if (existingUser.length > 0) {
      return res.status(400).send("User already exists.");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert new user into Users table
    const createUserQuery = `
      INSERT INTO Users (full_name, profession, company, country, newsletter_opt_in)
      VALUES (?, ?, ?, ?, ?)
    `;
    const newUser = [
      full_name,
      profession,
      company,
      country,
      newsletter_opt_in,
    ];
    const [userResult] = await pool.execute(createUserQuery, newUser);

    const userId = userResult.insertId;

    // Insert email and password into UserCredentials table
    const createCredentialsQuery = `
      INSERT INTO UserCredentials (user_id, email, password_hash, is_Blocked)
      VALUES (?, ?, ?, ?)
    `;
    const newCredentials = [userId, email, password_hash, blocked];
    await pool.execute(createCredentialsQuery, newCredentials);

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Server error.");
  }
};

const editUser = async (req, res) => {
  const { id: _id, email, name, role } = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(_id, {
      email,
      name,
      role,
    });
    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updateUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Server error.");
  }
};

module.exports = { createUser, editUser, deleteUser, getAllUsers };
