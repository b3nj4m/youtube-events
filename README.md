youtube-events
==============

```javascript
window.onYouTubePlayerReady = function(id) {
  if (id === playerApiId) {
    var timeElem = document.getElementById('current-time');

    ytEvents = new YoutubeEvents(document.getElementById(playerId), {interval: 5});

    ytEvents.on('playing paused', function() {
      window.console.log('something happened!');
    });

    //receive a 'time' event every 5th second the video has played
    //e.g. at time 0:00, 0:05, 0:10, ...
    ytEvents.on('time', function(time) {
      timeElem.textContent = time;
    });
  }
};
```
