(function() {
  var log = function(message) {
    if (window.console !== undefined && window.console.log !== undefined) {
      window.console.log(message);
    }
  };

  var bind = function(fn, context) {
    return function() {
      fn.apply(context, arguments);
    };
  };

  //'listen' for the youtube player to be ready by waiting for the global callback onYouTubePlayerReady to be called :/
  var youtubePlayerReady = {};
  var readyQueues = {};
  window.onYouTubePlayerReady = function(id) {
    youtubePlayerReady[id] = true;
    
    if (readyQueues[id] !== undefined) {
      for (var i in readyQueues[id]) {
        readyQueues[id][i].apply(this, arguments);
      }
    }
  };

  var onReady = function(id, fn) {
    if (youtubePlayerReady[id]) {
      window.setTimeout(function() { fn.call(this) }, 0);
    }
    else {
      if (readyQueues[id] === undefined) {
        readyQueues[id] = [];
      }
      readyQueues[id].push(fn);
    }
  };

  var defineModule = function(YT) {
    var YoutubeEvents = function(player, id, options) {
      if (typeof player === 'undefined') {
        throw new Error('A reference to the YouTube player is a required argument.');
      }

      if (typeof id === 'undefined') {
        throw new Error('The API ID is a required argument.');
      }

      this.player = player;
      this.id = id;

      if (typeof options !== 'undefined') {
        this.bucketSize = options.bucketSize || this.bucketSize;
      }

      this.registry = {};

      this.pollCallback = bind(this._pollCallback, this);

      onReady(this.id, bind(this.setupPlayerEvents, this));
    };

    //size of video time buckets in seconds (e.g. bucketSize of 5s will result in events at video time 0:00, 0:05, 0:10, ...)
    //this value can be a float
    YoutubeEvents.prototype.bucketSize = 5;

    //how often to poll the video time in ms
    YoutubeEvents.prototype.pollInterval = 100;

    YoutubeEvents.prototype.startPolling = function() {
      if (!this.isPolling) {
        this.pollCallback();
        this.isPolling = true;
      }
    };

    YoutubeEvents.prototype.stopPolling = function() {
      if (this.isPolling) {
        if (this.timeout !== undefined) {
          window.clearTimeout(this.timeout);
          delete this.timeout;
        }
        this.isPolling = false;
      }
    };

    YoutubeEvents.prototype.updateCurrentBucket = function() {
      this.currentTime = this.player.getCurrentTime();
      var bucket = Math.floor(this.currentTime / this.bucketSize) * this.bucketSize;
      if (this.currentBucket !== bucket) {
        this.currentBucket = bucket;
        this.trigger('bucket', this.currentTime, this.currentBucket);
      }
    };

    YoutubeEvents.prototype._pollCallback = function() {
      this.updateCurrentBucket();
      this.timeout = window.setTimeout(this.pollCallback, this.pollInterval);
    };

    YoutubeEvents.prototype.stateChange = function(state) {
      if (state === YT.PlayerState.PLAYING) {
        this.startPolling();
      }
      else {
        this.stopPolling();
        this.updateCurrentBucket();
      }

      for (var key in YT.PlayerState) {
        if (YT.PlayerState.hasOwnProperty(key) && state === YT.PlayerState[key]) {
          evnt = key.toLowerCase();
          this.trigger(evnt, this.currentTime);
          this.trigger('state-changed', this.currentTime, evnt);
        }
      }
    };

    YoutubeEvents.prototype.setupPlayerEvents = function() {
      //make sure function name is unique
      var callbackNamePrefix = '__youtubeEventsPlayerStateChange';
      var callbackName = callbackNamePrefix;
      while (typeof window[callbackName] !== 'undefined') {
        callbackName = callbackNamePrefix + Math.random().toString().replace(/\.-/g, '');
      }
      window[callbackName] = bind(this.stateChange, this);
      this.player.addEventListener('onStateChange', callbackName);

      onReady(this.id, bind(this.ready, this));
    };

    YoutubeEvents.prototype.ready = function() {
      this.updateCurrentBucket();
      this.trigger('ready', this.currentTime);
    };

    YoutubeEvents.prototype.on = function(eventName, callback) {
      if (typeof callback === 'function') {
        var events = eventName.split(' ');
        for (var i in events) {
          if (this.registry[events[i]] === undefined) {
            this.registry[events[i]] = [];
          }
          this.registry[events[i]].push(callback);
        }
      }
      return this;
    };

    YoutubeEvents.prototype.off = function(eventName, callback) {
      if (typeof eventName === 'undefined') {
        if (typeof callback === 'undefined') {
          this.registry = {};
        }
        else {
          for (var key in this.registry) {
            if (this.registry.hasOwnProperty(key)) {
              this._offHelper(key, callback);
            }
          }
        }
      }
      else if (eventName in this.registry) {
        this._offHelper(eventName, callback);
      }

      return this;
    };

    YoutubeEvents.prototype._offHelper = function(eventName, callback) {
      var handlersToKeep = [];
      if (typeof callback !== 'undefined') {
        for (var i in this.registry[eventName]) {
          if (this.registry[eventName][i] !== callback) {
            handlersToKeep.push(this.registry[eventName][i]);
          }
        }
      }
      this.registry[eventName] = handlersToKeep;
    };

    YoutubeEvents.prototype.trigger = function(eventName) {
      if (eventName in this.registry) {
        //this.registry[eventName] may be replaced inside a callback if one of them calls .off()
        //so, we need to save a reference to it before we start the loop
        var callbacks = this.registry[eventName];
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i in callbacks) {
          callbacks[i].apply(this, args);
        }
      }
      return this;
    };

    return YoutubeEvents;
  };

  if (typeof define === 'function' && define.amd) {
    define('youtube-events', ['youtube'], defineModule);
  }
  else {
    window.YoutubeEvents = defineModule(window.YT);
  }
}());
