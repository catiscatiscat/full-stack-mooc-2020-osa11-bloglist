const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helpers = require('./test_helpers');
const User = require('../models/user');

const api = supertest(app);

const {
  initialUser,
  loginError,
} = helpers;

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const { username, name, password } = initialUser;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, name, passwordHash });

    await user.save();
  });

  describe('login', () => {
    test('succeeds with a correct username and password', async () => {
      const { username, name, password } = initialUser;
      const loginUser = {
        username,
        password,
      };

      const userWithToken = await api
        .post('/api/login')
        .send(loginUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(userWithToken.body.token).toBeDefined();
      expect(userWithToken.body.username).toBe(username);
      expect(userWithToken.body.name).toBe(name);
    });

    test('fails with a incorrect username', async () => {
      const { password } = initialUser;
      const loginUser = {
        username: 'wrong',
        password,
      };

      const loginResponse = await api
        .post('/api/login')
        .send(loginUser)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect([loginResponse.body]).toContainEqual(loginError);
    });

    test('fails with a incorrect password', async () => {
      const { username } = initialUser;
      const loginUser = {
        username,
        password: 'wrong',
      };

      const loginResponse = await api
        .post('/api/login')
        .send(loginUser)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect([loginResponse.body]).toContainEqual(loginError);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
