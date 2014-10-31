var events = require("events"),
    util = require("util"),
    Message = require("./message"),

    MESSAGE_INTERVAL = 1000,
    STATUS_MESSAGE = new Message({ type: "STATUS" });


function Unit(identity) {
  this._identity = identity;
  this._status = undefined;
  this._info = undefined;

  Object.defineProperties(this, {
    "status": {
      get: function() { return this._status; }
    },

    "info": {
      get: function() { return this._info; }
    },

    "identity": {
      value: identity,
      writable: false
    }
  });
}

util.inherits(Unit, events.EventEmitter);

Unit.prototype.readStatus = function(callback) {
};

//Unit.prototype.sendCommand = function(command, callback) {
//};

Unit.prototype.digestMessage = function(message) {
  switch (message.type) {
    case "HELLO":
      this._replyNow(new Message({ type: "HELLO" }));
      break;

    case "INFO":
      this._info = message.data;
      this.emit("infoReceived", this);
      this._replyNow(STATUS_MESSAGE);
      break;

    case "STATUS":
      this._status = message.data;
      this.emit("statusChange", this);
      this._replyLater(STATUS_MESSAGE, MESSAGE_INTERVAL);
      break;
  }
};

Unit.prototype._replyNow = function(message) {
  clearTimeout(this._timeoutId);
  this.emit("message", message);
};

Unit.prototype._replyLater = function(message, delay) {
  this._timeoutId = setTimeout(this._replyNow.bind(this, message), delay);
};

module.exports = Unit;
