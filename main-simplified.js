var bucketSize = 5;

ytEvents = new YoutubeEvents(document.getElementById(playerId), playerApiId, {bucketSize: bucketSize});

var contentElem = document.getElementById('contextual-content');

ytEvents.on('bucket', function(time, bucket) {
  contentElem.innerHTML = 'This is snippet of contextual content for bucket [' + bucket + 's, ' + (bucket + bucketSize) + 's)';
});
