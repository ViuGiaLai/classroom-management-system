const request = require('supertest');  // Thư viện để test API là jest supertest
const bcrypt = require('bcrypt'); // Import bcrypt
const mongoose = require('mongoose');
const app = require('../../server'); // import app, không start server
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
require('dotenv').config();

let token;

beforeAll(async () => {
  // Connect to the database
  await mongoose.connect(process.env.MONGO_URI);

  // Clean up the database to avoid duplicate key errors
  await User.deleteMany({});

  // Create an admin user and generate a token
  const adminUser = await User.create({
    full_name: 'Admin User',
    email: 'admin@example.com',
    password_hash: await bcrypt.hash('admin123', 10),
    role: 'admin',
  });
  token = generateToken(adminUser._id, adminUser.role);
});

afterAll(async () => {
  // Clean up database
  await User.deleteMany({});
  // Disconnect from the database
  await mongoose.disconnect();
});

describe('API /users', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        full_name: 'Test User',
        email: 'test_user@example.com', // Use a unique email
        password: '123456',
        role: 'student',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test_user@example.com', // Use the email from the previous test
        password: '123456',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
