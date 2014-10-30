//function Broker(options) {
//  var sock = zmq.socket("router");

//  sock.bindSync(options.addr || ADDR);
//  sock.on("message", onMessage);

//  function onMessage(identity, delimiter, msg) {
//    console.log(arguments);
//    console.log("received", identity, msg.toString());
//    sock.send([identity, delimiter, "echo " + msg.toString()]);
//  }
//}

var
    zmq = require("zmq"),
    events = require("events"),
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
    var unit = Unit(identity);

    unit.on("disconnect", removeUnit);
    unit.on("message", sendMessage.bind(undefined, unit));
    unit.on("change", unitChange);

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


function Unit(identity) {
  var instance = new events.EventEmitter(),
      unitInfo,
      unitKey,
      unitStatus,
      timeoutId,
      statusMessage = new Message({ type: "STATUS" });

  function digestMessage(message) {
    switch (message.type) {
      case "HELLO":
        sendMessage(new Message({ type: "HELLO" }));
        break;
      case "INFO":
        unitInfo = message.data;
        sendMessage(statusMessage);
        break;
      case "STATUS":
        unitStatus = message.data;
        instance.emit("change", instance);
        sendMessage(statusMessage);
        break;
    }
  }

  function sendMessage(message) {
    instance.emit("message", message);
  }

  instance.identity = identity;
  instance.digestMessage = digestMessage;
  instance.status = function() {
    return unitStatus;
  };
  instance.info = function() {
    return unitInfo;
  };
  return Object.freeze(instance);
}

module.exports = Broker;
