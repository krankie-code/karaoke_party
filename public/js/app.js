(function($) {
  var videoId = $("#video-id").text();
  console.log('video id: ' + videoId);
  
  var YTdeferred = $.Deferred();
  window.onYouTubeIframeAPIReady = function() {
    console.log('API ready');
    // resolve when youtube callback is called
    // passing YT as a parameter
    YTdeferred.resolve(window.YT);
  };

  // loads the IFrame Player API code asynchronously
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $(document).ready(function() {
    console.log('Document ready');
    var player;

    // whenever youtube callback was called = deferred resolved
    // your custom function will be executed with YT as an argument
    YTdeferred.done(function(YT) {
      console.log('executing iframe api ready')
      player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoId,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });

      function onPlayerReady(event) {
        event.target.playVideo();
      }

      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED) {
          document.getElementById("next-song").click();
        } 
      }
    });
  });
})(jQuery);

