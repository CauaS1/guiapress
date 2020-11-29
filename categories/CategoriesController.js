const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/categories/new", adminAuth, (req, res) => {
  res.render("admin/categories/new")
});

router.post("/categories/save", (req, res) => {
  const { title } = req.body;
  if (title != undefined) { //se o titulo for um valor nullo, ele redireciona 
    Category.create({
      title: title,
      slug: slugify(title)
    }).then(() => {
      res.redirect("/admin/categories")
    })
  } else {
    res.redirect("admin/categories/new");
  }
})

router.get("/admin/categories", adminAuth, (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/categories/index", {
      categories: categories
    })
  })
})

router.post("/categories/delete", (req, res) => {
  var id = req.body.id; //the name
  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({
        where: { id: id }
      }).then(() => {
        res.redirect("/admin/categories");
      })
    } else { //se o id nao for um numero
      res.redirect("/admin/categories");
    }
  } else { //se for null
    res.redirect("/admin/categories");
  }
})

router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
  const { id } = req.params;

  if(isNaN(id)) { //if is not a number
    res.redirect("/admin/categories");
  }

  Category.findByPk(id).then(category => {
    if (category != undefined) {
      res.render("./admin/categories/edit", { category });
    } else {
      res.redirect("/admin/categories");
    }
  }).catch(erro => {
    res.redirect("/admin/categories");
  })
});

router.post("/categories/update", (req, res) => {
  const { id, title } = req.body;
  //"I wanna change the title, the updated title is the variable title"
  Category.update({ title: title, slug: slugify(title) }, {
    where: { id: id }
  }).then(() => {
    res.redirect("/admin/categories");
  })
})

module.exports = router;

/*
IF THERE IS AN ERROR: "FAILED TO LOOKUP" YOU NEED TO USE A DOT (.)
IN THE RENDER LIKE: RES.RENDER("./")
*/
