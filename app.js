const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const flash = require("connect-flash")
const HomeRoute = require("./routes/home")
const AddBooksRoute = require("./routes/mybooks")
const LogInRoute = require("./routes/login")
const SignUpRoute = require("./routes/signup")
const LogoutRoute = require("./routes/logout")
const DetailRoute = require("./routes/detail")
const session = require("express-session")
const authMiddleware = require("./middleware/middleware")
const MongoStore = require("connect-mongodb-session")(session)
// express running from here
const app = express()
const MONGO_URI = "mongodb+srv://anankeitte:dOHBvH7mNjvSVvcu@mybookreview.wltm6zn.mongodb.net/"
//creating sessions in the mongodb
const store = new MongoStore({
  collection: "sessions",
  uri: MONGO_URI,
})
// creating express session
app.use(
  session({
    secret: "secret middleware",
    resave: false,
    saveUninitialized: false,
    store,
  })
)
app.use(authMiddleware)
// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err))

app.use(express.static("public"))
// Set EJS as the view engine
app.set("view engine", "ejs")
// Set the views directory
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(flash())
// Route for pages
app.use("/", HomeRoute)
app.use("/addbooks", AddBooksRoute)
app.use("/login", LogInRoute)
app.use("/signup", SignUpRoute)
app.use("/logout", LogoutRoute)
app.use("/detail", DetailRoute)

app.listen(5000, () => {
  console.log("Server has been started on Port 5000")
})
