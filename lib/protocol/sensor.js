var
    util = require("util"),
    events = require("events"),
    Message = require("./message"),
    zmq = require("zmq"),
    _ = require("lodash"),

    VERSION = "1.0";

function Sensor(options) {
  this.addr = options.addr;
  this.key = options.key;
  this.socket = null;
}

util.inherits(Sensor, events.EventEmitter);

_.extend(Sensor.prototype, {
  connect: function(callback) {
    this.socket = zmq.socket("req");
    this.socket.on("message", this._onMessage.bind(this));
    this._sendHello();
    // TODO emit event
  },

  disconnect: function(callback) {

  },

  setStatus: function(status) {
    this.status = status;
  },

  getStatus: function(status) {
    return this.status;
  },

  setInfo: function(info) {
    this.info = info;
  },

  getInfo: function() {
    return this.info;
  },

  _onMessage: function(buffer) {
    var message = Message.decode(buffer);
    // TODO emit event
    // TODO figure out response
  },

  _send: function(message) {
    this.socket.send(message.encode());
  },

  _sendHello: function() {
    var message = Message({
      type: "HELLO",
      version: VERSION,
      key: this.key
    });

    this._send(message);
  },

  _sendStatus: function() {
    var message = Message({
      type: "STATUS",
      status: this.status
    });

    this._send(message);
  },

  _sendInfo: function() {
    var message = Message({
      type: "INFO",
      info: this.info
    });

    this._send(message);
  },
});

module.exports = Sensor;
