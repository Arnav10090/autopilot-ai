import express from "express";
import { createUser, getUserByEmail, getUserById, updateUserPassword, deactivateUser } from "../db/user.repository.js";
import bcrypt from "bcrypt";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, dob } = req.body;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = await createUser({ name, email, password: passwordHash, phone, dob });

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if account is deactivated
    if (user.account_status === 'Inactive') {
      return res.status(403).json({ error: "This account has been deactivated" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/auth/profile/:id
router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[PROFILE] Fetching profile for ID: ${id}`); // Debug log

    // Integer validation for Serial ID
    if (!id || isNaN(id)) {
        console.error(`[PROFILE] Invalid ID format: ${id}`);
        return res.status(400).json({ error: "Invalid User ID" });
    }

    const user = await getUserById(id);
    if (!user) {
      console.warn(`[PROFILE] User not found for ID: ${id}`);
      return res.status(404).json({ error: "User not found" });
    }
    
    // Return full details except password (or include hashed if needed for UI "current password" check demo)
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      // For demo purposes only, sending back the "hash" so UI can populate "Current Password" field
      // In production, NEVER send password back.
      password_hash: user.password_hash 
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/auth/password
router.put("/password", async (req, res) => {
  try {
    const { user_id, new_password } = req.body;
    
    if (!user_id || !new_password) {
      return res.status(400).json({ error: "User ID and new password are required" });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(new_password, saltRounds);

    const result = await updateUserPassword(user_id, passwordHash);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// DELETE /api/auth/account/:id (soft delete - deactivates account)
router.delete("/account/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const result = await deactivateUser(id);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.error("Account deactivation error:", error);
    res.status(500).json({ error: "Failed to deactivate account" });
  }
});

export default router;
