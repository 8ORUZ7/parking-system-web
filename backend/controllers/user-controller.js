const jwt = require('jsonwebtoken');

const User = require('../models/user-model');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};

const signup = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    return res.status(400).json({ error: 'Missing required fields: email, password, name' });
  }

  try {
    const user = new User(req.body);

    //check if email already exists
    const usersWithSameEmail = await User.find({ email: user.email });
    if (usersWithSameEmail.length > 0 || user.email === process.env.ADMIN_EMAIL) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    await user.save();
    res.json({ message: 'Signup successful', user });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}

const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: 'Missing required fields: email, password' });
  }
  
  try {
    const { email, password } = req.body;
    let payload = {};
    //check if user is admin
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      payload = {
        email: process.env.ADMIN_EMAIL,
        name: 'Admin',
        role: 'admin'
      };
    } else {
      const users = await User.find({ email });
      if (users.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }
      if (users[0].password !== password) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      const user = users[0].toJSON();
      delete user.password;
      payload = {
        ...user,
        role: 'user'
      };
    }
    // Create and sign the JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ message: 'Login successful', token, user: payload });
      }
    );

  }catch(error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllUsers,
  signup,
  login,
};