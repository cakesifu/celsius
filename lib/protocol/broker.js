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


function Broker(options) {
  var registeredUnits = {},
      sock = zmq.socket("router");

  sock.bind(options.addr, bindDone);
  sock.on("message", receiveMessage);

  function bindDone() {
    console.log("bind complete", arguments);
  }

  function findUnit(identity) {
    return registeredUnits[identity];
  }

  function createUnit(identity) {
    var unit = Unit(identity, delimiter);

    unit.on("disconnect", removeUnit);
    unit.on("message", sendMessage);
    unit.on("change", unitChanges);
    return unit;
  }

  function unitChanges(unit) {
    console.log("unit change", unit);
  }

  function removeUnit(unit) {
  }

  function sendMessage(identity, message) {
    sock.send([identity, "", message]);
  }

  function receiveMessage(identity, delimiter, msg) {
    var unit = findUnit(identity) || createUnit(identity);

    unit.digestMessage(msg);
  }

  return {
  };
}

function Unit(identity) {

}
