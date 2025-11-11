import reviewsData from "@/services/mockData/reviews.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let reviews = [...reviewsData]

export const reviewService = {
  // Get all reviews for a product
  async getByProductId(productId) {
    await delay(300)
    return reviews
      .filter(review => review.productId === parseInt(productId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  // Get reviews by user (would use userId in real app)
  async getByUser(userEmail) {
    await delay(200)
    return reviews
      .filter(review => review.userEmail === userEmail)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  // Create new review
  async create(reviewData) {
    await delay(400)
    
    // Validate required fields
    if (!reviewData.productId || !reviewData.rating || !reviewData.userEmail) {
      throw new Error("Missing required fields")
    }
    
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error("Rating must be between 1 and 5")
    }

    // Check if user already reviewed this product
    const existingReview = reviews.find(
      r => r.productId === parseInt(reviewData.productId) && 
           r.userEmail === reviewData.userEmail
    )
    
    if (existingReview) {
      throw new Error("You have already reviewed this product")
    }

    const newReview = {
      Id: Math.max(...reviews.map(r => r.Id), 0) + 1,
      productId: parseInt(reviewData.productId),
      userEmail: reviewData.userEmail,
      userName: reviewData.userName || "Anonymous",
      rating: parseInt(reviewData.rating),
      comment: reviewData.comment?.trim() || "",
      createdAt: new Date().toISOString(),
      verified: true // Assuming all reviews are from verified purchases
    }

    reviews.push(newReview)
    return { ...newReview }
  },

  // Update existing review
  async update(id, updateData) {
    await delay(300)
    
    const index = reviews.findIndex(review => review.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Review not found")
    }

    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      throw new Error("Rating must be between 1 and 5")
    }

    const updatedReview = {
      ...reviews[index],
      ...updateData,
      rating: updateData.rating ? parseInt(updateData.rating) : reviews[index].rating,
      comment: updateData.comment?.trim() ?? reviews[index].comment,
      updatedAt: new Date().toISOString()
    }

    reviews[index] = updatedReview
    return { ...updatedReview }
  },

  // Delete review
  async delete(id) {
    await delay(200)
    
    const index = reviews.findIndex(review => review.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Review not found")
    }

    const deletedReview = reviews[index]
    reviews.splice(index, 1)
    return deletedReview
  },

  // Get review statistics for a product
  async getProductStats(productId) {
    await delay(200)
    
    const productReviews = reviews.filter(
      review => review.productId === parseInt(productId)
    )

    if (productReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / productReviews.length

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    productReviews.forEach(review => {
      ratingBreakdown[review.rating]++
    })

    return {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: productReviews.length,
      ratingBreakdown
    }
  }
}