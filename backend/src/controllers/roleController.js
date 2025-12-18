const Role = require('../models/Role');
const User = require('../models/User');
const { logAudit } = require('../utils/auditLogger');

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Get roles error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
      error: error.message
    });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required'
      });
    }

    const existingRole = await Role.findOne({ name: name.toLowerCase() });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role already exists'
      });
    }

    const role = new Role({
      name: name.toLowerCase(),
      description,
      permissions: permissions || [],
      isSystem: false
    });

    await role.save();

    await logAudit({
      action: 'role_created',
      actor: { userId: req.user._id, email: req.user.email },
      details: { roleName: role.name, permissions: role.permissions },
      req
    });

    return res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    console.error('Create role error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create role',
      error: error.message
    });
  }
};

const assignRole = async (req, res) => {
  try {
    const { userId, roleName } = req.body;

    if (!userId || !roleName) {
      return res.status(400).json({
        success: false,
        message: 'User ID and role name are required'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const role = await Role.findOne({ name: roleName.toLowerCase() });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    const previousRole = user.role;
    user.role = roleName.toLowerCase();
    await user.save();

    await logAudit({
      action: 'role_assigned',
      actor: { userId: req.user._id, email: req.user.email },
      target: { userId: user._id, email: user.email },
      details: { 
        previousRole, 
        newRole: roleName.toLowerCase() 
      },
      req
    });

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      success: true,
      message: 'Role assigned successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Assign role error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign role',
      error: error.message
    });
  }
};

module.exports = {
  getRoles,
  createRole,
  assignRole
};