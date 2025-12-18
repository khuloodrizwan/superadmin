const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');
const bcrypt = require('bcrypt');

describe('Authentication Tests', () => {
  let testUser;

  beforeAll(async () => {
    // Connect to test database
    const testDbUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/superadmin_test';
    await mongoose.connect(testDbUri);

    // Create a test user
    const hashedPassword = await bcrypt.hash('Test@123', 10);
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'superadmin',
      isActive: true
    });
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/auth/login', () => {
    test('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test@123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    test('should fail login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'Test@123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('should fail login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('should fail login with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Test@123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email and password are required');
    });

    test('should fail login with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email and password are required');
    });

    test('should fail login for inactive user', async () => {
      // Create inactive user
      const hashedPassword = await bcrypt.hash('Test@123', 10);
      const inactiveUser = await User.create({
        name: 'Inactive User',
        email: 'inactive@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: false
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'inactive@example.com',
          password: 'Test@123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Account is inactive');

      // Clean up
      await User.findByIdAndDelete(inactiveUser._id);
    });
  });

  describe('Health Check', () => {
    test('GET /health should return success', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
    });
  });
});