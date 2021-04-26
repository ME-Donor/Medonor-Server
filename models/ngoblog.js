const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const ngoblogSchema = Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const NgoBlogs = mongoose.model('ngoblog', ngoblogSchema);

module.exports = NgoBlogs;
