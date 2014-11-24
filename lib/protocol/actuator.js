var
    util = require("util"),
    Sensor = require("./sensor"),
    Message = require("./message"),
    zmq = require("zmq"),
    _ = require("lodash"),

    VERSION = "1.0",
    MESSAGE_TYPE_HANDLERS = {
      "HELLO": "_onHello",
      "STATUS": "_onStatus",
      "COMMAND": "_onCommand",
      "BYE": "_onBye"
    };
/*
class Actuator(options)
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
    * command:<cmd>
*/
function Actuator(options) {
  Sensor.call(this, options);
}

util.inherits(Actuator, Sensor);

_.extend(Actuator.prototype, {

  _onCommand: function(message) {
    var cmd = message.data.command;
    this.emit("command:" + cmd, message.data.params);
    this._sendStatus();
  }

});

module.exports = Sensor;
