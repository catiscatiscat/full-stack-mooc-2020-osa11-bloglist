const _ = require('lodash');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helpers = require('./test_helpers');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

const {
  addBlog,
  addUser,
  blogsInDb,
  blogWithoutLikes,
  getUserId,
  initialBlogs,
  invalidBlogs,
  loginUser,
  newBlog,
  invalidTokenError,
  wrongTokenError,
  initialUser,
  testUser,
} = helpers;

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
    await User.deleteMany({});
    await addUser();
  });

  describe('returning blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('all blogs are returned', async () => {
      const allBlogs = await blogsInDb();
      expect(allBlogs).toHaveLength(initialBlogs.length);
    });

    test('a specific blog is within the returned notes', async () => {
      const blogs = await blogsInDb();
      const contents = blogs.map(b => b.content);
      expect(contents).toContain(initialBlogs[1].content);
    });

    test('returned blogs have id-field', async () => {
      const blogs = await blogsInDb();
      _.each(blogs, blog => expect(blog.id).toBeDefined());
    });
  });

  describe('addition of blog', () => {
    test('succeeds with a valid blog and token', async () => {
      const token = await loginUser();
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await blogsInDb();
      const contents = blogsAtEnd.map(blog => _.omit(blog, 'id'));
      const userId = await getUserId();
      const addedBlog = { ...newBlog, user: userId.toString() };

      expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);
      expect(contents).toContainEqual(addedBlog);
    });

    test('without likes results a new blog with zero likes', async () => {
      const token = await loginUser();
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(blogWithoutLikes)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await blogsInDb();
      const contents = blogsAtEnd.map(blog => _.omit(blog, 'id'));
      const userId = await getUserId();
      const blogWithZeroLikes = {
        ...blogWithoutLikes,
        likes: 0,
        user: userId.toString(),
      };

      expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);
      expect(contents).toContainEqual(blogWithZeroLikes);
    });

    test('fails with a status code 400 if title or url is not given', async () => {
      const token = await loginUser();
      const promiseArray = invalidBlogs.map(invalid =>
        api
          .post('/api/blogs')
          .set('Authorization', `bearer ${token}`)
          .send(invalid)
          .expect(400)
      );
      await Promise.all(promiseArray);
    });

    test('fails with a status code 401 if token is not included', async () => {
      const contents = await api.post('/api/blogs').send(newBlog).expect(401);

      expect([contents.body]).toContainEqual(invalidTokenError);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with a status code 204 if id and token are valid', async () => {
      const blogToDelete = await addBlog();
      const blogsAtStart = await blogsInDb();
      expect(blogsAtStart).toContainEqual(blogToDelete);

      const token = await loginUser();

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
      expect(blogsAtEnd).not.toContainEqual(blogToDelete);
    });

    test('fails with a status code 400 if blogId is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445';
      const token = await loginUser();

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `bearer ${token}`)
        .expect(400);
    });

    test('fails with a status code 401 if token is not included', async () => {
      const blogToDelete = await addBlog();
      const blogsAtStart = await blogsInDb();
      expect(blogsAtStart).toContainEqual(blogToDelete);

      const contents = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401);

      expect([contents.body]).toContainEqual(invalidTokenError);
    });

    test('fails with a status code 401 if blogDeleter is not blogCreator', async () => {
      await addUser(initialUser);
      const blogToDelete = await addBlog(initialUser); // initialUser adds blog
      const blogsAtStart = await blogsInDb();
      expect(blogsAtStart).toContainEqual(blogToDelete);

      const token = await loginUser(testUser); // testUser tries to delete

      const contents = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(401);

      expect([contents.body]).toContainEqual(wrongTokenError);

      const blogsAtEnd = await blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
      expect(blogsAtEnd).toContainEqual(blogToDelete);
    });
  });

  describe('updation of a blog', () => {
    test('succeeds with a status code 200 if id and update object are valid', async () => {
      const blogsAtStart = await blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updateValue = { likes: 101 };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updateValue)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await blogsInDb();
      const contents = blogsAtEnd.map(blog => blog);
      const updatedBlog = { ...blogToUpdate, likes: 101 };

      expect(contents).toContainEqual(updatedBlog);
    });

    test('fails with a status code 400 if new likes is not a number', async () => {
      const blogsAtStart = await blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updateValue = { likes: 'asd' };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updateValue)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await blogsInDb();
      const contents = blogsAtEnd.map(blog => blog);

      expect(contents).toContainEqual(blogToUpdate);
    });

    test('fails with a status code 404 if blog with id not found', async () => {
      const blogsAtStart = await blogsInDb();
      const blogToFailUpdate = blogsAtStart[0];
      const updateValue = { likes: 101 };

      await Blog.deleteMany({});

      await api
        .put(`/api/blogs/${blogToFailUpdate.id}`)
        .send(updateValue)
        .expect(404);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
