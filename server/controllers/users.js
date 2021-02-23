const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();

const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {
      url: 1, title: 1, author: 1, id: 1,
    });
  response.json(users.map(user => user.toJSON()));
});

usersRouter.post('/', async (request, response) => {
  const { body } = request;

  if (body.password === undefined) {
    return response.status(400).json({ error: 'User validation failed: `password` is required.' });
  }
  if (body.password.length < 3) {
    return response.status(400).json({ error: 'User validation failed: `password` is shorter than minimun allowed length (3).' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  return response.json(savedUser);
});

module.exports = usersRouter;
