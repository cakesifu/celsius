var
    util = require("util"),
    Sensor = require("./sensor"),
    Message = require("./message"),
    _ = require("lodash");
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

});

module.exports = Sensor;
