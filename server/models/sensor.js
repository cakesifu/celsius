function Sensor(data) {
  this.data = data;
}

Sensor.prototype.read = function(callback) {
  callback(null, this);
}

Sensor.prototype.asJson = function(options) {
  return {
    "value": 50
  }
}

module.exports = Sensor;
