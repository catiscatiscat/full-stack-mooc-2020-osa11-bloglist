import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, updateBlog, deleteBlog, username }) => {
  const [showFull, setShowFull] = useState(false);

  const toggleShowFull = () => {
    setShowFull(!showFull);
  };

  const allowedToRemove = username === blog.user.username;
  const confirmMessage = `Really want to remove blog ${blog.title} by ${blog.author}?`;

  const handleUpdateBlog = () => {
    updateBlog({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    });
  };

  const handleDeleteBlog = () => {
    if (window.confirm(confirmMessage)) {
      deleteBlog({
        id: blog.id,
        title: blog.title,
      });
    }
  };

  return (
    <div className='blog'>
      <div id='blog-basic-info'>
        {blog.title} {blog.author}{' '}
        <button id='view-hide-btn' type='button' onClick={toggleShowFull}>
          {!showFull ? 'view' : 'hide'}
        </button>
      </div>
      <>
        {showFull && (
          <>
            <div>{blog.url}</div>
            <div id='likes'>
              {' '}
              Likes {blog.likes}{' '}
              <button
                id='like-btn'
                className='likeBtn'
                type='button'
                onClick={handleUpdateBlog}
              >
                Like
              </button>
            </div>
            <div>{blog.user.name}</div>
            {allowedToRemove && (
              <button
                id='remove-btn'
                className='removeBtn'
                type='button'
                onClick={handleDeleteBlog}
              >
                remove
              </button>
            )}
          </>
        )}
      </>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object,
  updateBlog: PropTypes.func,
  deleteBlog: PropTypes.func,
  username: PropTypes.string,
};

export default Blog;
