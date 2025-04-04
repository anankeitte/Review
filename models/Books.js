const { Schema, model } = require("mongoose")
const mongoose = require("mongoose")

const bookSchema = new Schema({
  image: { type: String, required: true }, // URL of the book cover
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Track user who added the book
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // References reviews
})

const Book = model("Book", bookSchema)
module.exports = Book
