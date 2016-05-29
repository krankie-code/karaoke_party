// requirements
var mongoose = require('mongoose');

// define schema
var songSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  img: String
});

// model methods

// map to mongoose
var Songs = mongoose.model('Songs', songSchema);

// export
module.exports = Songs;
