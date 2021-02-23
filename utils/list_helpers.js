const _ = require('lodash');

const dummy = blogs => (blogs.length === 0 ? 1 : 1);

const totalLikes = blogs => _.reduce(blogs, (sum, blog) => sum + blog.likes, 0);

const favoriteBlog = blogs => _.chain(blogs)
  .reduce((max, blog) => (blog.likes > max.likes ? blog : max))
  .pick(['title', 'author', 'likes'])
  .value();

const mostBlogs = blogs => _.chain(blogs)
  .countBy('author')
  .map((value, key) => ({
    author: key,
    blogs: value,
  }))
  .maxBy('blogs')
  .value();

const mostLikes = blogs => _.chain(blogs)
  .groupBy('author')
  .map((value, key) => {
    const likes = _.reduce(value, (sum, blog) => sum + blog.likes, 0);
    return {
      author: key,
      likes,
    };
  })
  .maxBy('likes')
  .value();

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
