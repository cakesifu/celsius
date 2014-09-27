var db = require("../../lib/db"),
    Sequelize = require("sequelize"),
    sequelize = db.getDatabase();

var User = module.exports = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  name: Sequelize.STRING
}, {
});
