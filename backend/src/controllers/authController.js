const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { logAudit } = require('../utils/auditLogger');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      await logAudit({
        action: 'login_failed',
        actor: { userId: null, email },
        details: { reason: 'User not found' },
        req
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await logAudit({
        action: 'login_failed',
        actor: { userId: user._id, email: user.email },
        details: { reason: 'Invalid password' },
        req
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    await logAudit({
      action: 'login_success',
      actor: { userId: user._id, email: user.email },
      details: { role: user.role },
      req
    });

    const token = generateToken(user._id, user.email, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

module.exports = { login };