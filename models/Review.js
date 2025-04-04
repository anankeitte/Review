const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  rating: { type: Number, required: true },
  text: { type: String, required: true },
})

module.exports = mongoose.model("Review", ReviewSchema)
