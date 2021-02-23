import React from 'react';
import PropTypes from 'prop-types';

const LoginForm = props => {
  const {
    submitHandler,
    username,
    password,
    handleNameChange,
    handlePasswordChange,
  } = props;

  return (
    <>
      <form onSubmit={submitHandler}>
        <div>
          username
          <input
            id='username-input'
            type='text'
            value={username}
            name='Username'
            onChange={handleNameChange}
          />
        </div>
        <div>
          password
          <input
            id='password-input'
            type='password'
            value={password}
            name='Password'
            onChange={handlePasswordChange}
          />
        </div>
        <button id='login-btn' type='submit'>
          login
        </button>
      </form>
    </>
  );
};

LoginForm.propTypes = {
  submitHandler: PropTypes.func,
  username: PropTypes.string,
  password: PropTypes.string,
  handleNameChange: PropTypes.func,
  handlePasswordChange: PropTypes.func,
};

export default LoginForm;
