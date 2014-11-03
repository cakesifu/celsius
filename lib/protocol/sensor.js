var
    util = require("util"),
    events = require("events"),
    Message = require("./message"),
    zmq = require("zmq"),
    _ = require("lodash"),

    VERSION = "1.0",
    MESSAGE_TYPE_HANDLERS = {
      "HELLO": "_onHello",
      "STATUS": "_onStatus",
      "BYE": "_onBye"
    };
/*
class Sensor(options)
  attributes:

  methods:
    * connect
    * disconnect
    * setValue
    * getValue
    * setInfo
    * getInfo
  events:
    * disconnect
    * connect
    * timeout
*/
function Sensor(options) {
  this.addr = options.addr;
  this.key = options.key;
  this.timeout = options.timeout || 10000;
}

util.inherits(Sensor, events.EventEmitter);

_.extend(Sensor.prototype, {
  connect: function() {
    if (this._connected) {
      return;
    }
    this.socket = zmq.socket("req");
    this.socket.on("message", this._onMessage.bind(this));
    this.socket.connect(this.addr);
    this._sendHello();
    this._connected = true;
  },

  disconnect: function() {
    if (!this._connected) {
      return;
    }
    this.socket.disconnect(this.addr);
    this._connected = false;
    this.emit("disconnect");
  },

  setValue: function(value) {
    this.value = value;
  },

  getValue: function(value) {
    return this.value;
  },

  setInfo: function(info) {
    this.info = info;
  },

  getInfo: function() {
    return this.info;
  },

  _onMessage: function(buffer) {
    var message = Message.decode(buffer),
        method = MESSAGE_TYPE_HANDLERS[message.type];

    this[method](message);
    this._restartHeartbeat();
  },

  _onHello: function(message) {
    this._sendInfo();
    this.emit("connect");
  },

  _onStatus: function(message) {
    this._sendStatus();
  },

  _onBye: function(message) {

  },

  _onTimeout: function() {
    this.disconnect();
    this.emit("timeout");
  },

  _restartHeartbeat: function() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }

    this._timeoutId = setTimeout(this._onTimeout.bind(this), this.timeout);
  },

  _send: function(message) {
    this.socket.send(message.encode());
  },

  _sendHello: function() {
    var message = new Message("HELLO", VERSION);

    this._send(message);
  },

  _sendStatus: function() {
    var message = new Message("STATUS", {
      value: this.value
    });

    this._send(message);
  },

  _sendInfo: function() {
    var message = new Message("INFO", {
      key: this.key,
      info: this.info
    });

    this._send(message);
  },
});

module.exports = Sensor;
