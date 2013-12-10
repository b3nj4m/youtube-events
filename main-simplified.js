window.onYouTubePlayerReady = function(id) {
  if (id === playerApiId) {
    var interval = 5;

    ytEvents = new YoutubeEvents(document.getElementById(playerId), {interval: interval});

    var contentElem = document.getElementById('contextual-content');

    ytEvents.on('bucket', function(time, bucket) {
      contentElem.innerHTML = 'This is snippet of contextual content for bucket [' + bucket + 's, ' + (bucket + interval) + 's)';
    });
  }
};
