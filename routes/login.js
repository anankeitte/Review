const { Router } = require("express")
const router = Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

router.get("/", (req, res) => {
  res.render("LogIn", { title: "Log In", error: req.flash("error"), loginError: req.flash("loginError") })
})

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body
    const candidate = await User.findOne({ email })

    if (candidate) {
      bcrypt.compare(password, candidate.password, (err, same) => {
        if (same) {
          req.session.user = candidate
          req.session.isAuthenticated = true
          req.session.save((err) => {
            if (err) throw err
            res.redirect("/")
          })
        } else {
          req.flash("loginError", "Password wrong")
          res.redirect("/login")
        }
      })
    }
  } catch (e) {
    req.flash("loginError", "This username does not found")
    console.log(e)
  }
})

module.exports = router
