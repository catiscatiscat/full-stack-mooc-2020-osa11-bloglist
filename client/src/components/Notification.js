import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message }) => {
  const notificationStyle = {
    background: 'lightgrey',
    fontSize: 20,
    border: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  const successStyle = { ...notificationStyle, color: 'green' };
  const errorStyle = { ...notificationStyle, color: 'red' };

  if (message === null) {
    return null;
  }
  if (message.type === 'success') {
    return (
      <div>
        <div id='success' style={successStyle}>{message.message}</div>
      </div>
    );
  }
  if (message.type === 'error') {
    return (
      <div>
        <div id='error' style={errorStyle}>{message.message}</div>
      </div>
    );
  }
  return <></>;
};

Notification.propTypes = { message: PropTypes.object };

export default Notification;
