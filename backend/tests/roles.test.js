const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');
const Role = require('../src/models/Role');
const bcrypt = require('bcrypt');
const { generateToken } = require('../src/config/jwt');

describe('Roles API Tests', () => {
  let superAdminToken;
  let superAdminUser;
  let testUserId;
  let testRoleId;

  beforeAll(async () => {
    // Connect to test database
    const testDbUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/superadmin_test';
    await mongoose.connect(testDbUri);

    // Create superadmin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    superAdminUser = await User.create({
      name: 'Super Admin',
      email: 'superadmin@test.com',
      password: hashedPassword,
      role: 'superadmin',
      isActive: true
    });

    // Generate token
    superAdminToken = generateToken(
      superAdminUser._id,
      superAdminUser.email,
      superAdminUser.role
    );

    // Create test roles
    await Role.create([
      {
        name: 'superadmin',
        description: 'Super Administrator',
        permissions: ['read_users', 'create_users', 'update_users', 'delete_users'],
        isSystem: true
      },
      {
        name: 'admin',
        description: 'Administrator',
        permissions: ['read_users', 'create_users'],
        isSystem: true
      },
      {
        name: 'user',
        description: 'Regular User',
        permissions: ['read_users'],
        isSystem: true
      }
    ]);

    // Create test user for role assignment
    const testUserPassword = await bcrypt.hash('Test@123', 10);
    const testUser = await User.create({
      name: 'Test User',
      email: 'testuser@test.com',
      password: testUserPassword,
      role: 'user',
      isActive: true
    });
    testUserId = testUser._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Role.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/roles', () => {
    test('should get all roles with valid token', async () => {
      const response = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should fail without authentication token', async () => {
      const response = await request(app).get('/api/roles');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should return roles sorted by name', async () => {
      const response = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      const roles = response.body.data;
      
      // Check if sorted
      for (let i = 0; i < roles.length - 1; i++) {
        expect(roles[i].name.localeCompare(roles[i + 1].name)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('POST /api/roles', () => {
    test('should create new role with valid data', async () => {
      const newRole = {
        name: 'manager',
        description: 'Manager role',
        permissions: ['read_users', 'update_users']
      };

      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(newRole);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newRole.name);
      expect(response.body.data.description).toBe(newRole.description);
      expect(response.body.data.permissions).toEqual(newRole.permissions);

      testRoleId = response.body.data._id;
    });

    test('should fail to create role with duplicate name', async () => {
      const duplicateRole = {
        name: 'manager',
        description: 'Another Manager',
        permissions: ['read_users']
      };

      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(duplicateRole);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Role already exists');
    });

    test('should fail to create role without name', async () => {
      const incompleteRole = {
        description: 'Role without name'
      };

      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(incompleteRole);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should create role with lowercase name', async () => {
      const newRole = {
        name: 'SUPERVISOR',
        description: 'Supervisor role',
        permissions: ['read_users']
      };

      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(newRole);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('supervisor');
    });
  });

  describe('POST /api/roles/assign', () => {
    test('should assign role to user successfully', async () => {
      const assignData = {
        userId: testUserId,
        roleName: 'admin'
      };

      const response = await request(app)
        .post('/api/roles/assign')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(assignData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('admin');

      // Verify user's role was updated in database
      const updatedUser = await User.findById(testUserId);
      expect(updatedUser.role).toBe('admin');
    });

    test('should fail with missing userId', async () => {
      const assignData = {
        roleName: 'admin'
      };

      const response = await request(app)
        .post('/api/roles/assign')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(assignData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should fail with missing roleName', async () => {
      const assignData = {
        userId: testUserId
      };

      const response = await request(app)
        .post('/api/roles/assign')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(assignData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should fail with non-existent user', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const assignData = {
        userId: fakeUserId,
        roleName: 'admin'
      };

      const response = await request(app)
        .post('/api/roles/assign')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(assignData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    test('should fail with non-existent role', async () => {
      const assignData = {
        userId: testUserId,
        roleName: 'nonexistent'
      };

      const response = await request(app)
        .post('/api/roles/assign')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(assignData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Role not found');
    });
  });

  describe('Authorization Tests', () => {
    let regularUserToken;

    beforeAll(async () => {
      // Create regular user
      const hashedPassword = await bcrypt.hash('User@123', 10);
      const regularUser = await User.create({
        name: 'Regular User',
        email: 'regular@test.com',
        password: hashedPassword,
        role: 'user',
        isActive: true
      });

      regularUserToken = generateToken(
        regularUser._id,
        regularUser.email,
        regularUser.role
      );
    });

    test('should deny role creation to non-superadmin', async () => {
      const newRole = {
        name: 'testrole',
        description: 'Test Role'
      };

      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(newRole);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('should deny role assignment to non-superadmin', async () => {
      const assignData = {
        userId: testUserId,
        roleName: 'admin'
      };

      const response = await request(app)
        .post('/api/roles/assign')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(assignData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});