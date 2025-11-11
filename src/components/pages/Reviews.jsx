import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import ReviewForm from "@/components/molecules/ReviewForm"
import ReviewCard from "@/components/molecules/ReviewCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { reviewService } from "@/services/api/reviewService"
import { productService } from "@/services/api/productService"
import { orderService } from "@/services/api/orderService"

const Reviews = () => {
  const location = useLocation()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [purchasedProducts, setPurchasedProducts] = useState([])
  
  // Mock user data - in real app would come from auth
  const currentUser = {
    email: "user@example.com",
    name: "John Doe"
  }

  const loadUserReviews = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [userReviews, orders] = await Promise.all([
        reviewService.getByUser(currentUser.email),
        orderService.getUserOrders(currentUser.email)
      ])
      
      // Get all purchased product IDs
      const purchasedProductIds = new Set()
      orders.forEach(order => {
        order.items.forEach(item => {
          purchasedProductIds.add(item.productId)
        })
      })
      
      // Get product details for purchased items
      const productDetails = await Promise.all(
        Array.from(purchasedProductIds).map(id => productService.getById(id))
      )
      
      // Filter out products that have already been reviewed
      const reviewedProductIds = new Set(userReviews.map(r => r.productId))
      const unreviewed = productDetails.filter(p => !reviewedProductIds.has(p.Id))
      
      setReviews(userReviews)
      setPurchasedProducts(unreviewed)
      
      // Auto-open form for specific product from URL
      const urlParams = new URLSearchParams(location.search)
      const productId = urlParams.get('productId')
      if (productId) {
        const product = productDetails.find(p => p.Id === parseInt(productId))
        if (product && !reviewedProductIds.has(product.Id)) {
          setSelectedProduct(product)
          setShowForm(true)
        }
      }
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserReviews()
  }, [location.search])

  const handleReviewSubmitted = () => {
    setShowForm(false)
    setSelectedProduct(null)
    loadUserReviews() // Refresh the reviews
  }

  const handleWriteReview = (product) => {
    setSelectedProduct(product)
    setShowForm(true)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadUserReviews} />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display font-bold text-primary mb-4"
        >
          My Reviews
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 max-w-2xl mx-auto"
        >
          Share your experience with products you've purchased and help other customers make informed decisions.
        </motion.p>
      </div>

      {/* Review Form */}
      {showForm && selectedProduct && (
        <div className="mb-8">
          <ReviewForm
            product={selectedProduct}
            userEmail={currentUser.email}
            userName={currentUser.name}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => {
              setShowForm(false)
              setSelectedProduct(null)
            }}
          />
        </div>
      )}

      {/* Products to Review */}
      {purchasedProducts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="Edit3" size={20} className="text-accent" />
            <h2 className="text-2xl font-display font-bold text-primary">
              Write Reviews
            </h2>
          </div>
          
          <div className="grid gap-4">
            {purchasedProducts.map((product) => (
              <div
                key={product.Id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-medium text-primary">{product.name}</h3>
                    <p className="text-sm text-gray-600">${product.price}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleWriteReview(product)}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-medium"
                >
                  <ApperIcon name="Star" size={16} />
                  Write Review
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* User's Reviews */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ApperIcon name="MessageSquare" size={20} className="text-accent" />
            <h2 className="text-2xl font-display font-bold text-primary">
              My Reviews ({reviews.length})
            </h2>
          </div>
        </div>

        {reviews.length === 0 ? (
          <Empty
            icon="MessageSquare"
            title="No Reviews Yet"
            description="You haven't written any reviews yet. Purchase some products and share your experience!"
            action={
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                <ApperIcon name="ShoppingBag" size={16} />
                Shop Now
              </Link>
            }
          />
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <ReviewCard key={review.Id} review={review} index={index} />
            ))}
          </div>
        )}
      </motion.section>
    </div>
  )
}

export default Reviews