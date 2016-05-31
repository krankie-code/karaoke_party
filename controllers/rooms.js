// requirements
var express = require('express');
var router = express.Router();
var request = require('request');
var Rooms = require('../models/rooms.js');
var Songs = require('../models/songs.js');
var songsController = require('./songs.js');
router.use('/', songsController);
var currentDomain = 'http%3A%2F%2Ftube%2Dkaraoke%2Eheroku%2Ecom';
var util = require('util');

function deepPrint(x){
  console.log(util.inspect(x, {showHidden: false, depth: null}));
}

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

// API V1
router.get('/api/v1', function(req,res){
  Rooms.find().then(function(rooms){
    res.json(rooms);
  })
});

// show room (player page)
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
    res.redirect('/rooms/' + req.params.id);
  });
});

// create room
router.post('/', function(req,res){
  console.log('creating room');
  console.log('req.body: ');
  deepPrint(req.body);
  var room = new Rooms(req.body);
  room.save(function(err, room){
    if(err){
      console.log(err);
    } else {
      console.log('created new room');
      res.redirect('/rooms/' + room.id + '/songs/add');
    }
  }).then(function(room){
    var results;
    console.log('room obj is: ' + room);
    request('https://api-ssl.bitly.com/v3/shorten?access_token=' + process.env.BITLY_KEY + '&format=txt&longUrl=' + currentDomain + '%2Frooms%2F' + room.id + '%2Fsongs%2Fadd', function(error, response, body){
      if(!error && response.statusCode == 200){
        room.bitlyLink = body.replace(/(\r\n|\n|\r)/gm," ");
        room.save(function(err){
          if(err){
            console.log(err);
          } else {
            console.log('saved room link');
          }
        })
        console.log(room);
      }
    })  
  })
});

// delete room
router.delete('/:id', function(req,res){
  console.log('deleting room' + req.params.id.name);
  console.log('req params fields: ' 
        + Object.getOwnPropertyNames(req.params));
  Rooms.remove({_id: req.params.id}).exec();
  res.redirect('/rooms');
});

module.exports = router;
