const { Router } = require("express")
const router = Router()
const Book = require("../models/Books")
const auth = require("../middleware/authentificated")

router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login")
  }
  const userBooks = await Book.find({ createdBy: req.session.user._id })
  res.render("AddBooks", { title: "Add Books", userBooks, error: req.flash("error"), success: req.flash("success") })
})

// POST Create a Book
router.post("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login")
  }

  try {
    const { bookimage, title, authorname, description } = req.body

    // Create new book
    const newBook = new Book({
      image: bookimage,
      title: title,
      author: authorname,
      description: description,
      createdBy: req.session.user._id,
    })

    await newBook.save()
    res.redirect("/")
  } catch (error) {
    console.error("Error adding book:", error)
    res.status(500).send("Internal Server Error")
  }
})

// Editing book I added
router.get("/:id/edit", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book || book.createdBy.toString() !== req.session.user._id.toString()) {
      req.flash("error", "You can only edit your own books.")
      return res.redirect("/addbooks") // Redirect to the page with your books
    }

    res.render("edit-book", { title: `Edit Book - ${book.title}`, book, user: req.session.user })
  } catch (error) {
    console.error("Error fetching book:", error)
    req.flash("error", "Something went wrong.")
    res.redirect("/addbooks")
  }
})

// Update Book (POST request)
router.post("/:id/edit", auth, async (req, res) => {
  try {
    const { title, authorname, bookimage, description } = req.body
    const bookId = req.params.id

    const book = await Book.findById(bookId)

    if (!book || book.createdBy.toString() !== req.session.user._id.toString()) {
      req.flash("error", "You can only edit your own books.")
      return res.redirect("/addbooks")
    }

    // Update the book with new data
    book.image = bookimage
    book.title = title
    book.author = authorname
    book.description = description

    await book.save()

    req.flash("success", "Book updated successfully!")
    res.redirect("/addbooks")
  } catch (error) {
    console.error("Error updating book:", error)
    req.flash("error", "Something went wrong.")
    res.redirect(`/addbooks/${req.params.id}`)
  }
})

// Delete Book (POST request)
router.post("/delete-book/:id", auth, async (req, res) => {
  try {
    const bookId = req.params.id
    const book = await Book.findById(bookId)

    if (!book || book.createdBy.toString() !== req.session.user._id.toString()) {
      req.flash("error", "You can only delete your own books.")
      return res.redirect("/my-books")
    }

    // Delete the book
    await Book.findByIdAndDelete(bookId)

    req.flash("success", "Book deleted successfully!")
    res.redirect("/my-books")
  } catch (error) {
    console.error("Error deleting book:", error)
    req.flash("error", "Something went wrong.")
    res.redirect("/addbooks")
  }
})

module.exports = router
