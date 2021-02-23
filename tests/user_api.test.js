const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helpers = require('./test_helpers');
const User = require('../models/user');

const api = supertest(app);

const {
  usersInDb,
  initialUser,
  testUser,
  invalidUsernames,
  invalidUsernameErrors,
  invalidPasswords,
  invalidPasswordErrors,
} = helpers;

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const { username, password } = initialUser;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash });

    await user.save();
  });

  describe('addition of a new user', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await usersInDb();

      await api
        .post('/api/users')
        .send(testUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

      const usernames = usersAtEnd.map(u => u.username);
      expect(usernames).toContain(testUser.username);
    });

    test('creation fail if username absent, too short or exists', async () => {
      const promiseArray = invalidUsernames.map(invalid => api
        .post('/api/users')
        .send(invalid)
        .expect(400)
        .expect('Content-Type', /application\/json/));
      await Promise.all(promiseArray);
      const errorMessages = promiseArray.map(promise => promise.response.body);
      invalidUsernameErrors.forEach(error => expect(errorMessages).toContainEqual(error));
    });

    test('creation fail if password absent or too short', async () => {
      const promiseArray = invalidPasswords.map(invalid => api
        .post('/api/users')
        .send(invalid)
        .expect(400)
        .expect('Content-Type', /application\/json/));
      await Promise.all(promiseArray);
      const errorMessages = promiseArray.map(promise => promise.response.body);
      invalidPasswordErrors.forEach(error => {
        expect(errorMessages).toContainEqual(error);
      });
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
