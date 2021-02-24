const mongoose = require('mongoose');

// mongoose.set('useFindAndModify', false);

const blogSchema = mongoose.Schema({
  author: String,
  likes: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    if (returnedObject.user && !returnedObject.user.username) returnedObject.user = returnedObject.user.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
