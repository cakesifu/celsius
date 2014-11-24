#!/usr/bin/env node

var
    _ = require("lodash"),
    blessed = require("blessed"),
    Actuator = require("../lib/protocol/actuator"),
    ADDR = "tcp://127.0.0.1:8081",
    KEY = process.argv[2] || "foobar",
    HELP = "t        - toggle heater status\n" +
           "c        - connect heater\n" +
           "d        - disconnect heater",
    VALUES = {
      0: "OFF",
      1: "ON"
    },
    heaterOn = 0;

var heater = new Actuator({
  addr: ADDR,
  key: KEY,
  timeout: 2000,
  info: {
    name: "Dummy Heater",
    location: "Screen2"
  }
});

heater.connect();
heater.on("connect", function() {
  log("heater connected to broker");
});

heater.on("disconnect", function() {
  log("heater disconnected from broker");
});

var screen = blessed.screen();
var stateBox = blessed.box({
  top: 0,
  left: 0,
  width: '25%',
  height: '25%',
  border: {
    type: 'line'
  },
  tags: true,
  label: "State",
  content: ""
});
var helpBox = blessed.box({
  top: 0,
  right: 0,
  width: "75%",
  height: "25%",
  border: {
    type: "line"
  },
  label: "Help",
  content: HELP
});

var logBox = blessed.box({
  top: "25%",
  bottom: 0,
  width: "100%",
  height: "75%",
  border: {
    type: "line"
  },
  scrollable: true,
  label: "log",
  content: ""
});

screen.key("c", function() { heater.connect(); });
screen.key("d", function() { heater.disconnect(); });
screen.key("t", function() { setValue(1- heaterOn); });

screen.key(["C-c", "q"], function(ch, key) {
  return process.exit(0);
});

screen.append(stateBox);
screen.append(helpBox);
screen.append(logBox);


setValue(0);

function setValue(value) {
  heaterOn = (!!value) ? 1 : 0;
  heater.setValue({value: heaterOn});
  stateBox.setContent("{center}{bold}" + VALUES[heaterOn] + "{/bold}{/center}");
  log("New value: " + VALUES[heaterOn]);
  screen.render();
}

function log(message) {
  logBox.pushLine(message);
  screen.render();
}
