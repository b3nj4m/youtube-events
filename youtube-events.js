(function() {
  var error = function(message) {
    if (window.console !== undefined && window.console.error !== undefined) {
      window.console.error(message);
    }
  };

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

  var defineModule = function(YT) {
    var YoutubeEvents = function(player, options) {
      if (typeof player === 'undefined') {
        error('a reference to the YouTube player is a required argument');
      }

      this.player = player;

      if (typeof options !== 'undefined') {
        this.interval = options.interval || this.interval;
      }

      this.registry = {};

      this.pollCallback = bind(this._pollCallback, this);

      this.setupPlayerEvents();
    };

    //video time interval between events in seconds (e.g. interval of 5s will result in events at video time 0:00, 0:05, 0:10, ...)
    YoutubeEvents.prototype.interval = 5;

    //how often to poll the video time in ms
    YoutubeEvents.prototype.pollInterval = 100;

    YoutubeEvents.prototype.startPolling = function() {
      if (!this.isPolling) {
        this.pollCallback();
        this.isPolling = true;
      }
    };

    YoutubeEvents.prototype.stopPolling = function() {
      if (this.timeout !== undefined) {
        window.clearTimeout(this.timeout);
        delete this.timeout;
        this.isPolling = false;
      }
    };

    YoutubeEvents.prototype._pollCallback = function() {
      var currentTime = this.player.getCurrentTime();
      if (this.lastEventTime === undefined || (this.lastEventTime !== undefined && currentTime - this.lastEventTime >= this.interval)) {
        this.lastEventTime = currentTime;
        this.trigger('time', currentTime);
      }

      this.timeout = window.setTimeout(this.pollCallback, this.pollInterval);
    };

    YoutubeEvents.prototype.stateChange = function(state) {
      for (var key in YT.PlayerState) {
        if (YT.PlayerState.hasOwnProperty(key) && state === YT.PlayerState[key]) {
          this.trigger(key.toLowerCase(), this.player.getCurrentTime());
        }
      }

      if (state === YT.PlayerState.PLAYING) {
        this.startPolling();
      }
      else {
        this.stopPolling();
      }
    };

    YoutubeEvents.prototype.setupPlayerEvents = function() {
      //TODO make sure function name is unique
      var callbackName = '__youtubeEventsPlayerStateChange';
      window[callbackName] = bind(this.stateChange, this);
      this.player.addEventListener('onStateChange', callbackName);
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
      if (eventName in this.registry) {
        var handlersToKeep = [];
        if (typeof callback !== 'undefined') {
          for (var i in this.registry[eventName]) {
            if (this.registry[eventName][i] !== callback) {
              handlersToKeep.push(this.registry[eventName][i]);
            }
          }
        }
        this.registry[eventName] = handlersToKeep;
      }

      return this;
    };

    YoutubeEvents.prototype.trigger = function(eventName, data) {
      if (eventName in this.registry) {
        for (var i in this.registry[eventName]) {
          this.registry[eventName][i].call(this, data);
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
