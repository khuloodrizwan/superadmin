const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../src/config/jwt');

describe('Users API Tests', () => {
  let superAdminToken;
  let superAdminUser;
  let testUserId;

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
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/users', () => {
    test('should get all users with valid token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('users');
      expect(Array.isArray(response.body.data.users)).toBe(true);
    });

    test('should fail without authentication token', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should support search functionality', async () => {
      const response = await request(app)
        .get('/api/users?search=super')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=5')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('pagination');
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
    });
  });

  describe('POST /api/users', () => {
    test('should create new user with valid data', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'Password@123',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(newUser.email);
      expect(response.body.data.name).toBe(newUser.name);
      expect(response.body.data).not.toHaveProperty('password');

      testUserId = response.body.data._id;
    });

    test('should fail to create user with duplicate email', async () => {
      const duplicateUser = {
        name: 'John Duplicate',
        email: 'john@test.com',
        password: 'Password@123',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(duplicateUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already exists');
    });

    test('should fail to create user with missing required fields', async () => {
      const incompleteUser = {
        name: 'Incomplete User'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/:id', () => {
    test('should get user by id', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testUserId);
    });

    test('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update user successfully', async () => {
      const updateData = {
        name: 'John Updated',
        role: 'admin'
      };

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.role).toBe(updateData.role);
    });

    test('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ name: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should delete user successfully', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User deleted successfully');
    });

    test('should return 404 when deleting non-existent user', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('should not allow deleting superadmin user', async () => {
      const response = await request(app)
        .delete(`/api/users/${superAdminUser._id}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cannot delete superadmin user');
    });
  });

  describe('Authorization Tests', () => {
    let regularUserToken;

    beforeAll(async () => {
      // Create regular user
      const hashedPassword = await bcrypt.hash('User@123', 10);
      const regularUser = await User.create({
        name: 'Regular User',
        email: 'user@test.com',
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

    test('should deny access to non-superadmin users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Super admin role required');
    });
  });
});