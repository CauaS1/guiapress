const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category")

const Article = connection.define('articles', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  },
});

Category.hasMany(Article); //Uma categoria TEM MUITOS artigos
Article.belongsTo(Category);  //Um artico PERTENCE A uma categoria

// Article.sync({force: false})


module.exports = Article;