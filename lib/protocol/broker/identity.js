function Identity(buffer) {
  Object.defineProperties(this, {
    raw: {value: buffer},
    hex: {value: buffer.toString("hex")}
  });

  return Object.freeze(this);
}

Identity.prototype.toString = function() {
  return this.hex;
};

Identity.prototype.valueOf = function() {
  return this.hex;
};

module.exports = Identity;
