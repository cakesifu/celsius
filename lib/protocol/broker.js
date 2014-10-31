var
    zmq = require("zmq"),
    events = require("events"),
    Unit = require("./unit"),
    Message = require("./message");


function Broker(options) {
  var registeredUnits = {},
      sock = zmq.socket("router"),
      instance = new events.EventEmitter();

  sock.bind(options.addr, bindDone);
  sock.on("message", receiveMessage);

  function bindDone() {
    console.log("bind complete", arguments);
  }

  function findUnit(identity) {
    return registeredUnits[identity];
  }

  function createUnit(identity) {
    var unit = new Unit(identity);

    registeredUnits[identity] = unit;

    unit.on("disconnect", removeUnit);
    unit.on("message", sendMessage.bind(undefined, unit));
    unit.on("statusChange", unitChange);

    instance.emit("unitConnect", unit);
    return unit;
  }

  function unitChange(unit) {
    instance.emit("unitChange", unit);
  }

  function removeUnit(unit) {
    instance.emit("unitDisconnect", unit);
    delete registeredUnits[unit.identity];
  }

  function sendMessage(unit, message) {
    sock.send([unit.identity, "", message.encode()]);
  }

  function receiveMessage(identity, delimiter, data) {
    var unit = findUnit(identity) || createUnit(identity),
        message = Message.decode(data);

    unit.digestMessage(message);
  }

  return instance;
}

module.exports = Broker;
