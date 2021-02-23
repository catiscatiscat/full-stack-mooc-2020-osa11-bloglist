const jtw = require('jsonwebtoken');

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1,
      id: 1,
    });
  response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post('/', async (request, response) => {
  const { body } = request;
  const decodedToken = jtw.verify(request.token, process.env.SECRET);

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    author: body.author,
    likes: body.likes,
    title: body.title,
    url: body.url,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  return response.json(savedBlog.toJSON());
});

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jtw.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    if (blog.user.toString() === decodedToken.id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      return response.status(204).end();
    }
  }

  return response.status(401).json({ error: 'not authorized to delete' });
});

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request;

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, body, { new: true });

  if (updatedBlog) {
    response.json(updatedBlog.toJSON());
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
