function Message(type, data) {
  this.type = type;
  this.data = data;
}

Message.prototype.encode = function() {
  return JSON.stringify({
    type: this.type,
    data: this.data
  });
};

Message.decode = function(buffer) {
  var raw = JSON.parse(buffer.toString());

  return new Message(raw.type, raw.data);
};

module.exports = Message;
