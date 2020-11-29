const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = connection.define('categories', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: { //isso é um titulo para url, tipo se for assim: How to install NodeJS 2020,
    //in the URL, it would be .../how-to-install-nodejs-2020/, but need a DEPENCENCE NAMED SLUGIFY
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Category.sync({force: false})


module.exports = Category;