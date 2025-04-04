const { Router } = require("express")
const router = Router()
const Book = require("../models/Books") // Import the Book model

router.get("/", async (req, res) => {
  try {
    const books = await Book.find() // Fetch all books from MongoDB
    res.render("index", { title: "Review Books", books }) // Pass books to EJS
  } catch (error) {
    console.error("Error fetching books:", error)
    res.status(500).send("Internal Server Error")
  }
})

module.exports = router
