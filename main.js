require.config({
  paths: {
    'youtube': 'http://www.youtube.com/player_api?noext'
  },
  shim: {
    'swfobject': {
      exports: 'swfobject'
    },
    'youtube': {
      exports: 'YT'
    }
  }
});

define(['youtube-events', 'swfobject'], function(YoutubeEvents, swfobject) {
  var playerId = 'test-player';
  var playerApiId = 'ytplayer';
  var containerId = 'ytapiplayer';
  var params = { allowScriptAccess: "always" };
  var atts = { id: playerId };
  swfobject.embedSWF("http://www.youtube.com/v/jFdKsbNhfmQ?enablejsapi=1&playerapiid=" + playerApiId + "&version=3", containerId, "425", "356", "8", null, null, params, atts);

  window.onYouTubePlayerReady = function(id) {
    if (id === playerApiId) {
      var timeElem = document.getElementById('current-time');

      ytEvents = new YoutubeEvents(document.getElementById(playerId));
      ytEvents.on('time', function(time) {
        timeElem.textContent = time;
      });
    }
  }
});
