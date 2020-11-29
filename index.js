const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const commentsController = require("./comments/CommentController");
const usersController = require("./user/UserController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");
const Comment = require("./comments/Comment");

//View engine
app.set("view engine", 'ejs');

//Sessions
app.use(session({
  secret: "qualquercoisabemaleatorio",
  cookie: { maxAge: 7200000 }, //2 HOURS, isso é o tempo que os dados ficam salvo, e quando acabar, ele vai fazer logout (nesse caso)
  resave: true,      //se reiniciar o server, as sessions são apagadas
  saveUninitialized: true
}))

//static 
app.use(express.static("public"));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); //alem de acitar dados do formulario, aceita tbm do json

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Success!");
  })
  .catch((error) => {
    console.log(`Erro ${error}`)
  })

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", commentsController);
app.use("/", usersController);

app.get("/session", (req, res) => {
  req.session.treinamento = "fromação nodejs";
  req.session.ano = 2020;
  res.send("Sessão gerada");
});

app.get("/leitura", (req, res) => {
  res.json({
    treinamento: req.session.treinamento,
    ano: req.session.ano
  })
});

//Routes
app.get("/", (req, res) => {
  Article.findAll({
    order: [
      ["id", "DESC"],    
    ],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render("index", { articles: articles, categories: categories});
    });
  });
})

app.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  Article.findOne({
    where: { slug: slug,  }
  }).then(article => {
    if(article != undefined) {
      Category.findAll().then(categories => {
        res.render("article", { article : article, categories: categories});
      })
    } else {
      res.redirect("/");
    }
  }).catch(erro => {
    res.redirect("/")
  });
});

app.get("/category/:slug", (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: { slug: slug },
    include: [{model: Article}]
  }).then(category => {
    if(category != undefined) {
      Category.findAll().then(categories => {
        res.render("index", { articles: category.articles, categories: categories });
      });
    } else {
      res.redirect("/");
    }
  }).catch(() => {
    res.redirect("/")
  })
})


app.listen(5500, () => {
  console.log("Running")
});

