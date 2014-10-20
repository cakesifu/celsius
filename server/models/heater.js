function Heater(data) {
  this.data = data || {};
}

Heater.prototype.read = function(callback) {
  callback(null, this);
};

Heater.prototype.setState = function(state, callback) {
  callback(null, this);
};

Heater.prototype.asJson = function(options) {
  return {
    "state": 50,
    "key": this.data.key,
  };
};

module.exports = Heater;
