// requirements
var express = require('express');
var router = express.Router();
var request = require('request');
var Rooms = require('../models/rooms.js');
var Songs = require('../models/songs.js');
var songsController = require('./songs.js');
router.use('/', songsController);

// rooms index
router.get('/', function(req,res){
  console.log('get route working');
  Rooms.find().then(function(rooms){
    res.render('index.ejs', {rooms: rooms});
  })
});

// new room
router.get('/new', function(req,res){
  console.log('new route working');
  res.render('new.ejs');
});

// room player (show pg)
router.get('/:id', function(req,res){
  Rooms.findById(req.params.id).then(function(room){
    console.log('getting room show: ' + room);
    res.render('show.ejs', {room: room});
  });
});

// edit room
router.get('/:id/edit', function(req,res){
  Rooms.findById(req.params.id).then(function(room){
    console.log('getting room edit: ' + room);
    res.render('edit.ejs', {room: room});
  });
});

// update room
router.put('/:id', function(req,res){
  Rooms.findOneAndUpdate({_id: req.params.id}, req.body, function(err, room){
    console.log('updating room');
    console.log('req.body: ' + req.body);
    if(err){
      console.log(err);
    } else {
      console.log(room);
    }
    res.redirect('/rooms' + req.params.id);
  });
});

// create room
router.post('/', function(req,res){
  console.log('creating room');
  console.log('req.body: ' + req.body);
  var room = new Rooms(req.body);
  room.save(function(err){
    if(err){
      console.log(err);
    } else {
      console.log('created new room');
    }
  })
  res.redirect('/rooms/' + room.id + '/songs/add');
});

module.exports = router;
