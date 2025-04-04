const { Router } = require("express")
const router = Router()
const Book = require("../models/Books")
const Review = require("../models/Review")
const auth = require("../middleware/authentificated")

// Book detail page
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate({
      path: "reviews",
      populate: { path: "user", select: "fullName occupation _id" }, // Populate user details
    })

    if (!book) return res.status(404).send("Book not found")

    res.render("detail", { title: book.title, book, user: req.session.user, error: req.flash("error"), success: req.flash("success") }) // Pass user info
  } catch (error) {
    console.error("Error fetching book details:", error)
    res.status(500).send("Internal Server Error")
  }
})

router.post("/:id/review", auth, async (req, res) => {
  try {
    const { rating, review } = req.body
    const bookId = req.params.id
    const userId = req.session.user._id ? req.session.user._id : null // ✅ Use req.user from middleware

    if (!userId) {
      req.flash("error", "You must be logged in to submit a review.")
      return res.redirect(`/detail/${bookId}`)
    }

    if (!rating || !review) {
      req.flash("error", "All fields are required.")
      return res.redirect(`/detail/${bookId}`)
    }

    // Create new review
    const newReview = new Review({
      book: bookId,
      user: userId,
      rating: parseInt(rating),
      text: review,
    })

    await newReview.save()

    // Add review to book
    await Book.findByIdAndUpdate(bookId, { $push: { reviews: newReview._id } })

    req.flash("success", "Review added successfully!")
    res.redirect(`/detail/${bookId}`)
  } catch (error) {
    console.error("Error while saving review:", error)
    req.flash("error", "Something went wrong.")
    res.redirect(`/detail/${req.params.id}`)
  }
})

router.post("/:id/review/:reviewId/delete", auth, async (req, res) => {
  try {
    const { id, reviewId } = req.params
    const userId = req.session.user._id

    // Find the review and check if the user owns it
    const review = await Review.findById(reviewId)
    if (!review) {
      req.flash("error", "Review not found.")
      return res.redirect(`/detail/${id}`)
    }

    if (review.user.toString() !== userId.toString()) {
      req.flash("error", "You can only delete your own reviews.")
      return res.redirect(`/detail/${id}`)
    }

    // Delete review
    await Review.findByIdAndDelete(reviewId)

    // Remove review from book's reviews array
    await Book.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })

    req.flash("success", "Review deleted successfully!")
    res.redirect(`/detail/${id}`)
  } catch (error) {
    console.error("Error deleting review:", error)
    req.flash("error", "Something went wrong.")
    res.redirect(`/detail/${req.params.id}`)
  }
})

// Review editing
router.get("/:id/review/:reviewId/edit", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    const review = await Review.findById(req.params.reviewId).populate("user")

    if (!book || !review) {
      req.flash("error", "Review not found.")
      return res.redirect(`/detail/${req.params.id}`)
    }

    if (review.user._id.toString() !== req.session.user._id.toString()) {
      req.flash("error", "You can only edit your own reviews.")
      return res.redirect(`/detail/${req.params.id}`)
    }

    res.render("edit-review", { title: `Edit Review - ${book.title}`, book, review, user: req.user })
  } catch (error) {
    console.error("Error fetching book or review:", error)
    req.flash("error", "Something went wrong.")
    res.redirect(`/detail/${req.params.id}`)
  }
})

// after editing
router.post("/:id/review/:reviewId/edit", auth, async (req, res) => {
  try {
    const { review, rating } = req.body
    const { id, reviewId } = req.params
    const userId = req.session.user._id

    const existingReview = await Review.findById(reviewId)

    if (!existingReview) {
      req.flash("error", "Review not found.")
      return res.redirect(`/detail/${id}`)
    }

    if (existingReview.user.toString() !== userId.toString()) {
      req.flash("error", "You can only edit your own reviews.")
      return res.redirect(`/detail/${id}`)
    }

    // Update review text
    existingReview.text = review
    existingReview.rating = parseInt(rating)
    await existingReview.save()

    req.flash("success", "Review updated successfully!")
    res.redirect(`/detail/${id}`)
  } catch (error) {
    console.error("Error updating review:", error)
    req.flash("error", "Something went wrong.")
    res.redirect(`/detail/${req.params.id}`)
  }
})

module.exports = router
