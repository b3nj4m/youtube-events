var options = {
  interval: 5, //interval in seconds used to divide the video timeline into buckets
  pollInterval: 100 //interval in milliseconds at which the playing video will be polled for its current position
};

var youtubeEvents = new YoutubeEvents(playerElem, options);

//The time argument that all event handlers receive represents the current position in the video timeline in seconds.

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