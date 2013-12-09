youtube-events
==============

```javascript
window.onYouTubePlayerReady = function(id) {
  if (id === playerApiId) {
    var timeElem = document.getElementById('current-time');

    ytEvents = new YoutubeEvents(document.getElementById(playerId), {interval: 5});
    //receive a 'time' event every 5th second the video has played
    ytEvents.on('time', function(time) {
      timeElem.textContent = time;
    });
  }
};
```
