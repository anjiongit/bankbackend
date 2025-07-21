import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Account
export const createAccount = async (req, res) => {
  try {
    const { name, email, balance } = req.body;
    const newAccount = new User({ name, email, balance });
    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Accounts
export const getAccounts = async (req, res) => {
  try {
    const accounts = await User.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get account balance by user ID
export const getBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await User.findById(id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({
      name: account.name,
      email: account.email,
      balance: account.balance
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Transfer Balance
export const transfer = async (req, res) => {
  try {
    const { fromId, toId, amount } = req.body;
    const from = await User.findById(fromId);
    const to = await User.findById(toId);

    if (!from || !to) return res.status(404).json({ message: 'Account not found' });
    if (from.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    from.balance -= amount;
    to.balance += amount;

    await from.save();
    await to.save();

    res.json({ message: 'Transfer successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deposit Money
export const deposit = async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    const account = await User.findById(accountId);

    if (!account) return res.status(404).json({ message: 'Account not found' });

    account.balance += amount;
    await account.save();

    res.json({ message: 'Deposit successful', updatedBalance: account.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Withdraw Money
export const withdraw = async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    const account = await User.findById(accountId);

    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    account.balance -= amount;
    await account.save();

    res.json({ message: 'Withdrawal successful', updatedBalance: account.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
