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

  var timeElem = document.getElementById('current-time');

  ytEvents = new YoutubeEvents(document.getElementById(playerId), playerApiId, {bucketSize: 5});

  ytEvents.on('ready', function(time) {
    window.console.log('player is ready');
  });

  ytEvents.on('state-changed', function(time, state) {
    window.console.log('state changed to: ', state);
  });

  ytEvents.on('playing paused', function(time) {
    window.console.log('player started playing or was paused!');

    ytEvents.off('paused');
  });

  ytEvents.on('bucket', function(time, bucket) {
    timeElem.textContent = bucket;
  });
});
