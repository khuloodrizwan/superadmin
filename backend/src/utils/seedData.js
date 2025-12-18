require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Role = require('../models/Role');
const connectDB = require('../config/database');

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Role.deleteMany({});

    console.log('Creating roles...');
    const roles = [
      {
        name: 'superadmin',
        description: 'Super Administrator with full system access',
        permissions: [
          'read_users', 'create_users', 'update_users', 'delete_users',
          'manage_roles', 'view_audit_logs', 'view_analytics', 'manage_settings'
        ],
        isSystem: true
      },
      {
        name: 'admin',
        description: 'Administrator with limited access',
        permissions: ['read_users', 'create_users', 'update_users', 'view_analytics'],
        isSystem: true
      },
      {
        name: 'user',
        description: 'Regular user',
        permissions: ['read_users'],
        isSystem: true
      },
      {
        name: 'viewer',
        description: 'View-only access',
        permissions: ['read_users'],
        isSystem: true
      }
    ];

    await Role.insertMany(roles);
    console.log('Roles created successfully');

    console.log('Creating superadmin user...');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const superadmin = new User({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'superadmin',
      isActive: true
    });

    await superadmin.save();
    console.log('Superadmin user created successfully');
    console.log('Email: superadmin@example.com');
    console.log('Password: Admin@123');

    console.log('\nCreating sample users...');
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('User@123', 10),
        role: 'user',
        isActive: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('Admin@123', 10),
        role: 'admin',
        isActive: true
      },
      {
        name: 'Bob Viewer',
        email: 'bob@example.com',
        password: await bcrypt.hash('Viewer@123', 10),
        role: 'viewer',
        isActive: true
      }
    ];

    await User.insertMany(sampleUsers);
    console.log('Sample users created successfully');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();