const bcrypt = require('bcrypt');
const supertest = require('supertest');

const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
];

const newBlog = {
  title: 'blog added',
  author: 'tester',
  url: 'url_to_new_blog',
  likes: 12,
};

const blogWithoutLikes = {
  title: 'blog without likes',
  author: 'disliker',
  url: 'url_to_not_like',
};

const invalidBlogs = [
  {
    title: 'no url',
    author: 'ulrless man',
    likes: 100,
  },
  {
    author: 'titleless girl',
    url: 'url_to_no_title',
    likes: 13,
  },
];

const initialUser = {
  username: 'root',
  name: 'root user',
  password: 'sekret',
};

const testUser = {
  username: 'testaaja',
  name: 'John Doe',
  password: 'tosisalainen',
};

const invalidUsernames = [
  {
    name: 'No username',
    password: 'salainen',
  },
  {
    username: 'sh',
    name: 'Too Short',
    password: 'salainen',
  },
  {
    username: 'root',
    name: 'Username Exists',
    password: 'salainen',
  },
];

const invalidUsernameErrors = [
  {
    error: 'User validation failed: username: Path `username` is required.',
  },
  {
    error:
      'User validation failed: username: Path `username` (`sh`) is shorter than the minimum allowed length (3).',
  },
  {
    error:
      'User validation failed: username: Error, expected `username` to be unique. Value: `root`',
  },
];

const invalidPasswords = [
  {
    username: 'passless',
    name: 'No password',
  },
  {
    username: 'shorhpass',
    name: 'Too Short Password',
    password: 'xx',
  },
];

const invalidPasswordErrors = [
  { error: 'User validation failed: `password` is required.' },
  {
    error:
      'User validation failed: `password` is shorter than minimun allowed length (3).',
  },
];

const loginError = {
  error: 'invalid username or password',
};

const invalidTokenError = {
  error: 'invalid token',
};

const wrongTokenError = {
  error: 'not authorized to delete',
};

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

const addUser = async (user = testUser) => {
  const { username, name, password } = user;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  await newUser.save();
  return newUser._id.toString();
};

const loginUser = async (user = testUser) => {
  const { username, password } = user;
  const userToLogin = {
    username,
    password,
  };
  const userWithToken = await api.post('/api/login').send(userToLogin);
  return userWithToken.body.token;
};

const getUserId = async (user = testUser) => {
  const userInfo = await User.findOne({ username: user.username });
  return userInfo._id;
};

const addBlog = async (user = testUser) => {
  const token = await loginUser(user);
  const blogInfo = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog);
  return blogInfo.body;
};

module.exports = {
  addBlog,
  initialBlogs,
  newBlog,
  blogWithoutLikes,
  invalidBlogs,
  invalidTokenError,
  initialUser,
  testUser,
  invalidUsernames,
  invalidUsernameErrors,
  invalidPasswords,
  invalidPasswordErrors,
  loginError,
  nonExistingId,
  blogsInDb,
  usersInDb,
  addUser,
  loginUser,
  getUserId,
  wrongTokenError,
};
