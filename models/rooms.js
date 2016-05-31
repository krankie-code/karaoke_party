// requirements
var mongoose = require('mongoose');
var SongSchema = require('./songs.js').schema;

// define schema
var roomSchema = new mongoose.Schema({
  name: String,
  bitlyLink: {type: String, default: null},
  playlist: [SongSchema], // later add name of room?
  searchResults: [SongSchema],
  setup: {type: Boolean, default: true},
});

// model methods


// map to mongoose
var Rooms = mongoose.model('Rooms', roomSchema);

// export
module.exports = Rooms;
