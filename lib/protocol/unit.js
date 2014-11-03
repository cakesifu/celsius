var events = require("events"),
    util = require("util"),
    Message = require("./message"),

    MESSAGE_INTERVAL = 1000,
    HEARTBEAT_TIMEOUT = 1000,
    STATUS_MESSAGE = new Message("STATUS");

/*
class Unit(identity, transport)
  attributes:
    * identity
    * status
    * info
  methods:
    * readStatus
    * disconnect
    * digestMessage
  events:
    * disconnect
    * statusChanged
    * infoReceived
*/
function Unit(identity, transport) {
  this._status = undefined;
  this._info = undefined;
  this.transport = transport;

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

Unit.prototype._clearHeartbeat = function() {
  if (this._heartbeatTimeoutId) {
    clearTimeout(this._heartbeatTimeoutId);
  }
};

Unit.prototype._setHearbeat = function(delay) {
  this._clearHeartbeat();
  this._heartbeatTimeoutId = setTimeout(this.disconnect.bind(this), delay);
};

Unit.prototype.disconnect = function() {
  this.emit("disconnect", this);
};

Unit.prototype.digestMessage = function(message) {
  this._clearHeartbeat();
  switch (message.type) {
    case "HELLO":
      this._replyNow(new Message("HELLO", "1.0"));
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
  this._setHearbeat(HEARTBEAT_TIMEOUT);
  clearTimeout(this._replyTimeoutId);
  this.transport.send(message);
};

Unit.prototype._replyLater = function(message, delay) {
  this._replyTimeoutId = setTimeout(this._replyNow.bind(this, message), delay);
};

module.exports = Unit;
