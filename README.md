youtube-events
==============

A better alternative to the outdated YouTube Javascript API.

```javascript
window.onYouTubePlayerReady = function(id) {
  if (id === playerApiId) {
    var timeElem = document.getElementById('current-time');

    ytEvents = new YoutubeEvents(document.getElementById(playerId), {interval: 5});

    ytEvents.on('state-changed', function(state) {
      window.console.log('state changed to: ', state);
    });

    ytEvents.on('playing paused', function() {
      window.console.log('player started playing or was paused!');
    });

    //receive a 'time' event every `interval` seconds (in this example 5s) the video has played
    //e.g. at time 0:00, 0:05, 0:10, ...
    ytEvents.on('time', function(time) {
      timeElem.textContent = time;
    });
  }
};
```
