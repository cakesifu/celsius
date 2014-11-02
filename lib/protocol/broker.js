var
    zmq = require("zmq"),
    events = require("events"),
    util = require("util"),
    Unit = require("./unit"),
    Message = require("./message");

/**
 class Broker

  attributes:
    - activeUnits

  methods:
    - dispatchMessage
    - findUnit
    - createUnit
    - removeUnit
    - createTransport

  events:
    - unitConnected(unit)
    - unitDisconnected(unit)
*/

function Broker(options) {
  if (!(this instanceof Broker)) { return new Broker(options); }
  this._registeredUnits = {};
  this.socket = zmq.socket("router");

  this.socket.bind(options.addr);
  this.socket.on("message", this._onSocketMessage.bind(this));
}

util.inherits(Broker, events.EventEmitter);
Object.defineProperty(Broker.prototype, "activeUnits", {
  get: function() {
    var units = this._registeredUnits;
    return Object.keys(units).map(function(key) {
      return units[key];
    });
  }
});

Broker.prototype._onSocketMessage = function(identity, delimiter, data) {
  this.dispatchMessage(identity, data);
};

Broker.prototype.dispatchMessage = function(identity, data) {
  var unit = this.findUnit(identity) || this.createUnit(identity),
      message = Message.decode(data);

  unit.digestMessage(message);
};

Broker.prototype.findUnit = function(identity) {
  return this._registeredUnits[identity];
};

Broker.prototype.createUnit = function(identity) {
  var
      transport = this.createTransport(identity),
      unit = new Unit(identity, transport);

  this._registeredUnits[identity] = unit;
  unit.on("disconnect", this.removeUnit.bind(this, identity));
  unit.on("infoReceived", this.emit.bind(this, "unitInfo"));
  unit.on("statusChange", this.emit.bind(this, "unitStatus"));
  this.emit("unitConnected", unit);

  return unit;
};

Broker.prototype.removeUnit = function(identity) {
  console.log("disconnect");
  var unit = this.findUnit(identity);
  delete this._registeredUnits[identity];
  this.emit("unitDisconnected", unit);
};

Broker.prototype.createTransport = function(identity) {
  return {
    send: this.sendMessage.bind(this, identity)
  };
};

Broker.prototype.sendMessage = function(identity, message) {
  this.socket.send([identity, "", message.encode()]);
};

module.exports = Broker;
