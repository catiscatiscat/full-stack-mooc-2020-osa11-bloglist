const morgan = require('morgan');
const logger = require('./logger');

morgan.token('body', req => JSON.stringify(req.body));

const morganLogger = morgan(
  'INFO :method :url :status :res[content-length] - :response-time ms :body',
  { skip: () => process.env.NODE_ENV === 'test' }
);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }
  return next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  request.token = (authorization && authorization.toLowerCase().startsWith('bearer '))
    ? authorization.substring(7)
    : null;

  next();
};

module.exports = {
  morganLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
