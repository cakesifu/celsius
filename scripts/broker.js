#!/usr/bin/env node

var blessed = require("blessed"),
    Broker = require("../lib/protocol/broker"),
    ADDR = "tcp://127.0.0.1:8081",
    broker = Broker({
      addr: ADDR
    }),
    HELP = 'help',

    screen, helpBox, unitsBox, crtUnitBox;

screen = blessed.screen();
helpBox = blessed.box({
  top: 0,
  right: 0,
  width: '50%',
  height: '50%',
  tags: true,
  border: { type: 'line' },
  content: HELP,
  label: 'Help'
});

unitsBox = blessed.list({
  top: 0,
  left: 0,
  width: '50%',
  height: '100%',
  tags: true,
  border: { type: 'line' },
  label: 'Units',
  items: []
});

screen.append(helpBox);
screen.append(unitsBox);
screen.render();
unitsBox.focus();

screen.key(["C-c", "q"], function(ch, key) {
  return process.exit(0);
});

function renderUnitInList(unit) {
  var out = "[" + unit.identity.toString("hex") + "] ",
      info = unit.info,
      status = unit.status || {};
  if (unit.info) {
    out += "Key: " + info.key + ", Value: " + status.value;
  } else {
    out += "unknown unit";
  }
  return out;
}

function renderUnits() {
  var units = broker.activeUnits;
  unitsBox.setItems(units.map(renderUnitInList));
  screen.render();
}

broker.on("unitConnect", renderUnits);
broker.on("unitDisconnect", renderUnits);
broker.on("unitInfo", renderUnits);
broker.on("unitStatus", renderUnits);
