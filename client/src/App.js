import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';

import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import User from './components/User';

import blogService from './services/blogs';
import loginService from './services/login';

import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState(null);

  const blogFormRef = useRef();

  const timeOutTime = 3000;

  const messageTimeOut = time => {
    setTimeout(() => {
      setMessage(null);
    }, time);
  };

  useEffect(() => {
    const getBlogs = async () => {
      try {
        let initialBlogs = await blogService.getAll();
        initialBlogs = _.orderBy(
          initialBlogs,
          ['likes', 'title'],
          ['desc', 'asc']
        );
        setBlogs(initialBlogs);
        setMessage({
          message: 'Blogs succesfully loaded from server',
          type: 'success',
        });
        messageTimeOut(timeOutTime);
      } catch (error) {
        setMessage({
          message: 'Failed to get blogs from server',
          type: 'error',
        });
        messageTimeOut(timeOutTime);
      }
    };

    if (user) {
      getBlogs();
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleNameChange = event => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const addBlog = async blogObject => {
    try {
      blogFormRef.current.toggleVisibility();
      let returnedBlog = await blogService.create(blogObject);
      returnedBlog = {
        ...returnedBlog,
        user: { name: user.name, username: user.username },
      };
      setBlogs(blogs.concat(returnedBlog));
      setMessage({
        message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        type: 'success',
      });
      messageTimeOut(timeOutTime);
    } catch (error) {
      setMessage({
        message: 'failed to add a new blog',
        type: 'error',
      });
      messageTimeOut(timeOutTime);
    }
  };

  const updateBlog = async blogObject => {
    try {
      let returnedBlog = await blogService.update(blogObject);
      let blogToUpdate = _.find(blogs, blog => blog.id === returnedBlog.id);
      blogToUpdate = {
        ...blogToUpdate,
        likes: returnedBlog.likes,
      };
      const newBlogs = _(blogs)
        .filter(blog => blog.id !== returnedBlog.id)
        .concat(blogToUpdate)
        .orderBy(['likes', 'title'], ['desc', 'asc'])
        .value();

      setBlogs(newBlogs);
      setMessage({
        message: `blog's ${returnedBlog.title} likes updated`,
        type: 'success',
      });
      messageTimeOut(timeOutTime);
    } catch (error) {
      setMessage({
        message: 'failed to update blog',
        type: 'error',
      });
      messageTimeOut(timeOutTime);
    }
  };

  const deleteBlog = async blogObject => {
    try {
      await blogService.delBlog(blogObject.id);
      setBlogs(_.filter(blogs, blog => blog.id !== blogObject.id));
      setMessage({
        message: `blog ${blogObject.title} deleted`,
        type: 'success',
      });
      messageTimeOut(timeOutTime);
    } catch (error) {
      setMessage({
        message: 'failed to delete blog',
        type: 'error',
      });
      messageTimeOut(timeOutTime);
    }
  };

  const blogForm = () => (
    <Togglable buttonId='create-btn' buttonLabel='create a new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const handleLogin = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUsername('');
      setPassword('');
      setMessage({
        message: `${user.name} logged in`,
        type: 'success',
      });
      messageTimeOut(timeOutTime);
      setTimeout(() => {
        setUser(user);
      }, timeOutTime);
    } catch (error) {
      setMessage({
        message: 'wrong username or password',
        type: 'error',
      });
      messageTimeOut(timeOutTime);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogAppUser');
  };

  return (
    <div>
      <Notification message={message} />
      {user === null ? (
        <>
          <h2>log in to application</h2>
          <LoginForm
            username={username}
            password={password}
            handleNameChange={handleNameChange}
            handlePasswordChange={handlePasswordChange}
            submitHandler={handleLogin}
          />
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <User username={user.name} handleLogout={handleLogout} />
          {blogForm()}
          <div id='blogs' className='form'>
            {blogs.map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                username={user.username}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
