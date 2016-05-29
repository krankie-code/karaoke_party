// requirements
var express = require('express');
var router = express.Router();
var request = require('request');
var Rooms = require('../models/rooms.js');
var Songs = require('../models/songs.js');
var util = require('util');

function deepPrint(x){
  console.log(util.inspect(x, {showHidden: false, depth: null}));
}

// index page, renders a search bar and search results (if already queried)
router.get('/:id/songs/add', function(req,res){
  console.log('let\'s add a song to the queue');
  Rooms.findById(req.params.id).then(function(room){
    console.log(room);
    res.render('search.ejs', {room: room});
  })
})

router.get('/:id/songs/next', function(req,res){
  console.log('trigger next song');
  Rooms.findById(req.params.id, function(err, room){
    room.playlist.shift();
    room.save(function(err){
      if(err){
        console.log(err);
      } else {
        console.log('removed first song');
      }
      res.redirect('/rooms/'+ req.params.id);
    })
  })
});

// update route, once a user selects a song to queue up, it pushes it to the playlist & then resets searchResults
router.put('/:id/songs/', function(req,res){
  var selectedSong = {};
  Rooms.findById(req.params.id, function(err, room){
    selectedSong = room.searchResults.id(req.body.id);
    console.log('selected song id: ' + selectedSong.id);
    room.playlist.push({ _id: selectedSong.id, videoId: selectedSong.videoId, title: selectedSong.title, img: selectedSong.img });
    room.searchResults = [];
    room.save(function(err){
      if(err){
        console.log(err);
      } else {
        console.log('saved selected song to queue');
      }
      if(room.setup === true){
        room.setup = false;
        res.redirect('/rooms/' + req.params.id);
      } else {
        res.redirect('/rooms/' + req.params.id + '/songs/add');
      }
    });
  })
});

// post route 
router.post('/:id/songs/', function(req,res){
  console.log('get search route working');
  deepPrint(req.body);
  var searchTerms = req.body.search;
  searchTerms = searchTerms.toLowerCase().replace(/ /g,'+');
  console.log(searchTerms);
  var results;
  request('https://www.googleapis.com/youtube/v3/search?part=snippet&q=karaoke+' + searchTerms + '&type=video&key=' + process.env.GOOGLE_KEY, function(error, response, body){
    if(!error && response.statusCode == 200){
      results = JSON.parse(body);
      var returnedSongs = [];
      for(var i = 0; i < results.items.length; i++){
        var song = new Songs({
          videoId: results.items[i].id.videoId,
          title: results.items[i].snippet.title,
          img: results.items[i].snippet.thumbnails.medium.url
        });
        returnedSongs.push(song);
      }
      Rooms.findOneAndUpdate({_id: req.params.id}, {$set:{searchResults: returnedSongs}}, function(err, room){
          if(err){
            console.log(err);
          } else {
            console.log('set search results');
          }
          res.redirect('/rooms/'+ req.params.id + '/songs/add');
      });
    }
  });
});


module.exports = router;
