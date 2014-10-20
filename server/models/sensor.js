function Sensor(data) {
  this.data = data || {};
}

Sensor.prototype.read = function(callback) {
  callback(null, this);
};

Sensor.prototype.asJson = function(options) {
  return {
    "state": 50,
    "key": this.data.key
  };
};

module.exports = Sensor;
