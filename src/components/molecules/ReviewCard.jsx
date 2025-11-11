import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const ReviewCard = ({ review, index = 0 }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-primary">{review.userName}</h4>
            {review.verified && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <ApperIcon name="CheckCircle" size={12} />
                Verified Purchase
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
        </div>
        
        {/* Rating */}
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <ApperIcon
              key={i}
              name="Star"
              size={14}
              className={
                i < review.rating
                  ? "text-accent fill-current"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      )}

      {/* Updated indicator */}
      {review.updatedAt && review.updatedAt !== review.createdAt && (
        <p className="text-xs text-gray-500 mt-3 italic">
          Updated {formatDate(review.updatedAt)}
        </p>
      )}
    </motion.div>
  )
}

export default ReviewCard