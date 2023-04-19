let mongoose = require('mongoose');

let Schema = mongoose.Schema;

//Strings only
let articleModel = new Schema({
  coordinates: {
    type: [],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Article', articleModel);
