var request = require("superagent");

module.exports = {
  getSession: function(done) {
    request.get("/session/current").end(function(res) {
      done(res.body);
    });
  }

};
