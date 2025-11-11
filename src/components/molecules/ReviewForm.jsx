import { useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { reviewService } from "@/services/api/reviewService"
import { toast } from "react-toastify"

const ReviewForm = ({ product, userEmail, userName, onReviewSubmitted, onCancel }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review")
      return
    }

    setIsSubmitting(true)

    try {
      await reviewService.create({
        productId: product.Id,
        userEmail,
        userName,
        rating,
        comment: comment.trim()
      })

      toast.success("Thank you for your review!")
      
      // Reset form
      setRating(0)
      setComment("")
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-display font-bold text-primary mb-2">
          Write a Review
        </h3>
        <div className="flex items-center gap-3">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-md"
          />
          <div>
            <p className="font-medium text-primary">{product.name}</p>
            <p className="text-sm text-gray-600">${product.price}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary mb-3">
            Your Rating *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 rounded transition-colors hover:bg-gray-100"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <ApperIcon
                  name="Star"
                  size={24}
                  className={
                    star <= (hoveredRating || rating)
                      ? "text-accent fill-current"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary mb-3">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-accent focus:border-transparent"
            rows={4}
            maxLength={500}
            required
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Minimum 10 characters required
            </p>
            <p className="text-xs text-gray-500">
              {comment.length}/500 characters
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            className="flex-1 bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit Review"
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  )
}

export default ReviewForm