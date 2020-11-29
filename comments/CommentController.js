const { text } = require("body-parser");
const express = require("express");
const router = express.Router();
const Comment = require("./Comment");

router.get("/comments", (req, res) => {
  Comment.findAll().then((comments) => {
    res.render("comments/index", { comments });
  })
})

router.post("/comments/savecomment", (req, res) => {
  const { name, comment } = req.body;
    Comment.create({
      name: name,
      text: comment
    }).then(() => {
      res.redirect("/")
    }).catch(error => {
      console.log(error);
    })
})

router.post("/comments/delete", (req, res) => {
  const { id } = req.body;
  if (id != undefined) {
    if (!isNaN(id)) {
      Comment.destroy({
        where: { id: id }
      }).then(() => {
        res.redirect("/comments");
      })
    } else {
      res.redirect("/comments");
    }
  } else {
    res.redirect("/comments");
  }
});

router.get("/comments/edit/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.redirect("/comments");
  }

  Comment.findByPk(id).then(comment => {
    if (comment != undefined) {
      res.render("./comments/edit", { comment });
    } else {
      res.redirect("/comments")
    }
  });
});

router.post("/comments/update", (req,res) => {
  const { id, title } = req.body;
  Comment.update({ text: title }, {
    where: { id: id }
  }).then(() => {
    res.redirect("/comments")
  })
})


module.exports = router;