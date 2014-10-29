#!/usr/bin/env node

var zmq = require("zmq"),
    _ = require("lodash"),
    blessed = require("blessed"),
    Sensor = require("../lib/protocol/sensor"),
    ADDR = "tcp://127.0.0.1:7654",
    KEY = "foobar",

    crtTemperature = 20;

var sensor = new Sensor({
  addr: ADDR,
  key: KEY
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
  content: "foo"
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
  content: "help"
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

screen.append(stateBox);
screen.append(helpBox);
screen.append(logBox);
screen.render();


screen.key(["up", "down"], function(ch, key) {
  var factor = 0;
  if (key.name === "up") {
    factor = 1;
  } else if (key.name === "down") {
    factor = -1;
  }

  setTemp(crtTemperature + factor);
});


screen.key(["C-c", "q"], function(ch, key) {
  return process.exit(0);
});

function setTemp(temp) {
  crtTemperature = temp;
  sensor.setStatus(temp);
  stateBox.setContent("{center}{bold}" + temp + "{/bold}{/center}");
  log("New temperature: " + temp);
  screen.render();
}

function log(message) {
  logBox.pushLine(message);
  screen.render();
}
