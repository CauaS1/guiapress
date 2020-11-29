const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs"); //npm install bcryptjs

router.get("/admin/users", (req, res) => {
  User.findAll().then(users => {
    res.render("admin/users/index", { users })
  })
})

router.get("/admin/users/create", (req, res) => {
  res.render("./admin/users/create");
})

router.post("/users/create", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email: email } }).then(user => {
    if (user == undefined) {
      var salt = bcrypt.genSaltSync(10); //coloque um numero aleatorio
      var hash = bcrypt.hashSync(password, salt);

      User.create({
        email, password: hash
      }).then(() => {
        res.redirect("/");
      }).catch(() => {
        res.redirect("/");
      });
    } else {
      res.redirect("/admin/users/create");
    }
  })
  //res.json({email, hash}); //SEMPRE TESTE SE OS DADOS ESTÃO CHEGANDO
});

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email: email }}).then(user => {
    if(user != undefined) { //se existe um usuario com esse email
      //validar senha
      var correct = bcrypt.compareSync(password, user.password);
      if(correct) {
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.json(req.session.user);

      } else {
        res.redirect("/login");
      }

    } else {
      res.redirect("/login");
    }
  })
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
})

module.exports = router;