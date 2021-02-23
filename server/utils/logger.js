const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('INFO', ...params); // eslint-disable-line no-console
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('ERROR', ...params); // eslint-disable-line no-console
  }
};

module.exports = {
  info, error,
};
