import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleTitleChange = event => {
    setNewTitle(event.target.value);
  };

  const handleAuthorChange = event => {
    setNewAuthor(event.target.value);
  };

  const handleUrlChange = event => {
    setNewUrl(event.target.value);
  };

  const addBlog = event => {
    event.preventDefault();

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    setNewTitle('');
    setNewAuthor('');
    setNewUrl('');
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addBlog} className='blogForm'>
        <label>
          title <input id='title' value={newTitle} onChange={handleTitleChange} />
        </label>
        <label>
          Author <input id='author' value={newAuthor} onChange={handleAuthorChange} />
        </label>
        <label>
          url <input id='url' value={newUrl} onChange={handleUrlChange} />
        </label>
        <button className='createBtn' type='submit'>
          create
        </button>
      </form>
    </div>
  );
};

BlogForm.propTypes = { createBlog: PropTypes.func };

export default BlogForm;
