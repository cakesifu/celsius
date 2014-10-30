function Message(data) {
  this.type = data.type;
  this.version = data.version;
  this.data = data;
}

Message.prototype.encode = function() {
  return JSON.stringify(this.data);
};

Message.decode = function(buffer) {
  var data = JSON.parse(buffer.toString());
  return new Message(data);
};

module.exports = Message;
