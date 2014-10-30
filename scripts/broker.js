#!/usr/bin/env node

var Broker = require("../lib/protocol/broker"),
    ADDR = "tcp://127.0.0.1:7654",
    broker = Broker({
      addr: ADDR
    });

broker.on("unitConnect", function(unit) {
  console.log("unit connect", unit);
});

broker.on("unitDisconnect", function(unit) {
  console.log("unit disconnect", unit);
});

broker.on("unitIdentify", function(unit) {
  console.log("unit identified", unit.info());
});

broker.on("unitChange", function(unit) {
  console.log("unit change", unit.status());
});
