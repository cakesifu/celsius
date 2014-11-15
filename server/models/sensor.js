var _ = require("lodash");

function Sensor(data) {
  this.data = data || {};
}

Sensor.prototype.useBroker = function(broker) {
  this.broker = broker;
};

Sensor.prototype.read = function(broker) {
  var key = this.data.key,
      unit = _.find(broker.activeUnits, function(unit) {
    return unit.info.key === key;
  });

  this.state = unit && unit.status && unit.status.value;
};

Sensor.prototype.asJson = function(options) {
  return {
    "state": this.state,
    "key": this.data.key
  };
};

module.exports = Sensor;
