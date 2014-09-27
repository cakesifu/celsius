var convict = require("convict"),
    fs = require("fs"),
    _ = require("lodash"),

    config, env, files;

config = convict({
  env: {
    doc: "Application environment",
    default: "development",
    env: "NODE_ENV",
    arg: "env"
  },

  port: {
    doc: "Port to listen on",
    default: 3000,
    format: "port",
    env: "PORT",
    arg: "port"
  },

  url: {
    doc: "Full URL to app",
    format: "url",
    default: "http://127.0.0.1:3000"
  },

  db: {
    default: {
      doc: "Database connection options. Free-form JSON",
      format: Object,
      default: {}
    },
  },

  logger: {
    name: {
      doc: "Top level logger name",
      default: "app",
    },
    src: {
      doc: "Whether to show where the log message originates",
      format: Boolean,
      default: false,
    },
    console: {
      level: {
        doc: "Log level in console(stdout)",
        default: "debug"
      }
    }
  },

  static: {
    path: {
      doc: "Path for static assets",
      default: "./.dist"
    }
  }
});

var env = config.get("env");
env = config.get('env');

files = _.filter([
  "./config/" + env + ".json",
  "./config/" + env + ".local.json"
], fs.existsSync);

config.loadFile(files);

module.exports = config;
