#!/usr/bin/env node

var zmq = require("zmq");

var events = require("events"),
    util = require("util");

function Sensor(options) {
  this.sockets = options.sockets;
  this.key = options.key;

  this.broadcastSocket = zmq.socket('pub');
  this.commandSocket = zmq.socket('pull');

  this.broadcastSocket.bind(this.sockets.broadcast);
  this.commandSocket.bind(this.sockets.command);

  this.commandSocket.on("message", this._handleCommand.bind(this));
}

util.inherits(Sensor, events.EventEmitter);

Sensor.prototype.setState = function(state) {
  if (state !== this._state) {
    this._state = state;
    this.broadcast();
    this.emit("change", this._state);
  }
}

Sensor.prototype.getState = function() {
  return this._state;
}

Sensor.prototype.broadcast = function() {
  this.broadcastSocket.send({
    event: "state",
    value: this._state
  });
  this.emit("broadcast", message);
}

Sensor.prototype._handleCommand = function(command) {
  console.log("command received", command);
}


var sensor = new Sensor({
  sockets: {
    broadcast: "tcp://127.0.0.1:4001",
    command: "tcp://127.0.0.1:4002",
  },
  key: "secret-1"
});
