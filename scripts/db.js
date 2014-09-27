#!/bin/env node

var sequelize = require("../lib/db").getDatabase(),
    migrator = sequelize.getMigrator({
      path: __dirname + "/../migrations"
    });

var cmd = process.argv[2], commands;

commands = {
  drop: function() {
    require("../server/models");

    console.log("dropping database");
    sequelize.drop()
      .success(function() {
        console.info("- database dropped");
      })
      .error(function() {
        console.error("* error dropping database", arguments);
      });
  },

  create: function() {
    require("../server/models");

    console.log("sync-ing database");
    sequelize.sync()
      .success(function() {
        console.info("- database synced");
      })
      .error(function () {
        console.error("* error sync-ing db", arguments);
      });
  },

  migrate: function() {
    console.log("migrating database");
    migrator
      .migrate({ method: "up" })
      .success(function() {
        console.info("- migration successfull");
      })
      .error(function() {
        console.error("* error migrating db", arguments);
      });
  },

  rollback: function() {
    console.log("rollback database");
    migrator
      .migrate({ method: "down" })
      .success(function() {
        console.info("- rollback successfull");
      })
      .error(function() {
        console.error("* error rolling back db", arguments);
      });
  }
};

console.log("Running command %s", cmd);
console.log("------------------------------");
if (commands[cmd]) {
  commands[cmd]();
} else {
  console.error("Unknown command '%s'", cmd);
}
