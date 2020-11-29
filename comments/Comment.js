const Sequelize = require("sequelize");
const connection = require("../database/database");

const Comment = connection.define("comments", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

// Comment.sync({ force: false });

module.exports = Comment;