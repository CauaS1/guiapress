function adminAuth(req, res, next) {
  if(req.session.user != undefined) {
    next() //isso é obrigatorio
  } else { //se n tiver logado ele vai pra homepage
    res.redirect("/login");
  }
}

module.exports = adminAuth;