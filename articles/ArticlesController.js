const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

const adminAuth = require("../middlewares/adminAuth");

/*
ESSE "adminauth" NO MEIO, É UM MIDDLEWARE, ONDE VOCE VAI PODER CHAMAR FUNCOES NO MEIO DAS ROTAS
*/

router.get("/admin/articles", adminAuth, (req, res) => {
  Article.findAll({
    include: [{ model: Category }]
  }).then(articles => {
    res.render("./admin/articles/index", { articles });
  })
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
  Category.findAll().then(categories => {
    res.render("./admin/articles/new", { categories });
  })
});

router.post("/articles/save", adminAuth, (req, res) => {
  const { title, body, category } = req.body;
  Article.create({
    title,
    slug: slugify(title),
    body,
    categoryId: category //This is created when there is a RELEATIONSHIP (type: belongsTo)
  }).then(() => {
    res.redirect("/admin/articles");
  })
});

router.post("/articles/delete",(req, res) => {
  const { id } = req.body;
  if(id != undefined) {
    if(!isNaN(id)) {
      Article.destroy({
        where: { id: id }
      }).then(() => {
        res.redirect("/admin/articles");
      });
    } else {
      res.redirect("/admin/articles");
    }
  } else {
    res.redirect("/admin/articles");
  }
});

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
  const { id } = req.params;
  Article.findByPk(id).then(article =>{ //Esse pk siginifica porpucar por ID
    if(article != undefined) {
      Category.findAll().then(categories => {
        res.render("./admin/articles/edit", { categories, article }); //passamos o category por causa do select para selecioanr as categories
      });
   } else {
      res.redirect("/");
    }
  }).catch(() => {
    res.redirect("/")
  })
});

router.post("/articles/update", (req, res) => {
  var { id, body, title, category } = req.body;

  Article.update({title,  body, categoryId: category, slug: slugify(title)}, {
    where: { id: id }
  }).then(() => {
    res.redirect("/admin/articles");
  }).catch(err => {
    res.redirect("/");
  })
});

router.get("/articles/page/:num", (req, res) => {
  var page = req.params.num;
  var offset = 0; //de onde vai começar

  if(isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * 4; //parseInt converte o text "4" para 4
  } //4 é o limite de paginas q vc quer, vamos supor se vc tiver na pagina 2, vai mostrar 4 arquivos, do 4 ao 7

  Article.findAndCountAll({ //retrona os artigo e a quantidade de artigos que tem cadastrado nele
    limit: 4, //o maximo de artigos que retorna é 4,
    offset: offset, //dependendo do numero, ele so vai mostrar os artigos A PARTIR DAQUELE NUMERO
    order: [
      ["id", "DESC"],    
    ],
  }).then(articles => { 

    /*quando se trabalha com findAndCount ele retorna duas coisas
    COUNT e ROWS
    quantidade de elementos | rows: lista de artigos */

    var next;
    if(offset + 4 >= articles.count) { //articles.count é a quantidade de artigos
      next = false;
    } else {
      next = true;
    }

    var result = {
      page: parseInt(page),
      next: next,
      articles: articles
    }

    Category.findAll().then(categories => {
      res.render("./admin/articles/page", { result, categories })
    })
  })
})


module.exports = router;