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
  swfobject.embedSWF("http://www.youtube.com/v/jFdKsbNhfmQ?enablejsapi=1&playerapiid=" + playerApiId + "&version=3", containerId, "660", "410", "8", null, null, params, atts);

  var interval = 5;

  ytEvents = new YoutubeEvents(document.getElementById(playerId), playerApiId, {interval: interval});

  var contentElem = document.getElementById('contextual-content');

  ytEvents.on('bucket', function(time, bucket) {
    contentElem.innerHTML = 'This is a snippet of contextual content for bucket [' + bucket + 's, ' + (bucket + interval) + 's)';
  });
});
