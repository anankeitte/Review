const { Router } = require("express")
const User = require("../models/User")
const router = Router()
const bcrypt = require("bcrypt")

router.get("/", (req, res) => {
  res.render("SignUp", { title: "Create Account", error: req.flash("error"), loginError: req.flash("loginError") })
})

router.post("/", async (req, res) => {
  try {
    const { fullname, occupation, email, password } = req.body
    const candidate = await User.findOne({ email })

    if (candidate) {
      req.flash("error", "This email is already exist")
      res.redirect("/signup")
    } else {
      const hashPass = await bcrypt.hash(password, 10)
      const user = new User({
        fullName: fullname,
        occupation: occupation,
        email: email,
        password: hashPass,
      })
      await user.save()
      res.redirect("/login")
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
