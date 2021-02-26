const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const testingRouter = require('./controllers/testing');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const path = require('path');

const app = express();

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.morganLogger);

app.use(middleware.tokenExtractor);

app.get('/api/health', (req, res) => {
  res.send('ok');
});
app.get('/api/version', (req, res) => {
  res.send('16'); // change this string to ensure a new version deployed
});

app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}
app.use('/', express.static(path.join(__dirname, '/../client/build')));
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
