document.querySelectorAll(".reviews-stars").forEach((starContainer) => {
  const rating = parseInt(starContainer.getAttribute("data-rating"), 10) || 0
  starContainer.innerHTML = getStarRatingHTML(rating)
})

const ratingInput = document.getElementById("selectedRating")
const form = document.getElementById("reviewForm")

function getStarRatingHTML(rating) {
  let starsHTML = ""

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHTML += `<span style="color: #ffcc00;">★</span>` // Filled star
    } else {
      starsHTML += `<span style="color: #ccc;">★</span>` // Empty star
    }
  }

  return starsHTML
}

// Writing Review Submit Button action
document.addEventListener("DOMContentLoaded", () => {
  let selectedRating = 0

  // Select all stars and textarea
  const stars = document.querySelectorAll(".star")
  const textarea = document.querySelector("textarea")

  // Handle star selection
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = star.getAttribute("data-rating")
      ratingInput.value = star.getAttribute("data-rating")

      // Reset previous selections
      stars.forEach((s) => s.classList.remove("selected"))

      // Highlight selected stars
      for (let i = 0; i < selectedRating; i++) {
        stars[i].classList.add("selected")
      }
    })
  })

  // Handle submit button click
  form.addEventListener("submit", () => {
    const reviewText = textarea.value.trim()

    if (selectedRating === 0) {
      alert("Please select a rating before submitting!")
      return
    }

    if (reviewText === "") {
      alert("Please write a review before submitting!")
      return
    }

    alert(`Rating: ${selectedRating} stars\nReview: ${reviewText}`)
  })
})
