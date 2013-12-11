var options = {
  interval: 5, //interval in seconds used to divide the video timeline into buckets
  pollInterval: 100 //interval in milliseconds at which the playing video will be polled for its current position
};

//playerElem is a required reference to the root DOM element of the embedded player (usually an <object> when using swfobject)
//playerApiId is a required reference to the playerapiid that you included in the query string of your YouTube embed
//options are optional, defaults are shown above
var youtubeEvents = new YoutubeEvents(playerElem, playerApiId, options);

//The time argument that all event handlers receive represents the current position in the video timeline in seconds.

//ready is triggered when the YouTube player is ready (triggered by defining window.onYouTubePlayerReady. Do not overwrite plz.)
youtubeEvents.on('ready', function(time) {});

//unstarted is triggered when the player is loaded, but the video has not been started
youtubeEvents.on('unstarted', function(time) {});

//playing is triggered when the video starts playing
youtubeEvents.on('playing', function(time) {});

//paused is triggered when the video is paused
youtubeEvents.on('paused', function(time) {});

//buffering is triggered when the video is trying to play, but must wait for more data
youtubeEvents.on('buffering', function(time) {});

//ended is triggered when the video plays to the end
youtubeEvents.on('ended', function(time) {});

//state-changed is triggered whenever the state changes
//the state can be one of: 'unstarted', 'playing', 'paused', 'buffering', 'ended'
youtubeEvents.on('state-changed', function(time, stateName) {});

//bucket is triggered whenever the current bucket on the video timeline changes
//note that this can happen whether the video is playing or paused
//the argument bucket represents the left boundary of the current bucket.
youtubeEvents.on('bucket', function(time, bucket) {});
