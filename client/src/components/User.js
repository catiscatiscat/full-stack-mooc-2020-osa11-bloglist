import React from 'react';
import PropTypes from 'prop-types';

const User = props => {
  const { handleLogout, username } = props;

  return (
    <div className='user'>
      <p className='userText'>{username} is logged in</p>
      <button id='logout-btn' className='logoutBtn' type='button' onClick={handleLogout}>
        logout
      </button>
    </div>
  );
};

User.propTypes = {
  handleLogout: PropTypes.func,
  username: PropTypes.string,
};

export default User;
