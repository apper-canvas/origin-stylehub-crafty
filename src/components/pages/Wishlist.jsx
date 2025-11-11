import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { selectWishlistItems, removeFromWishlist } from "@/store/slices/wishlistSlice"
import { toast } from "react-toastify"

function Wishlist() {
  const wishlistItems = useSelector(selectWishlistItems)
  const dispatch = useDispatch()

  const handleRemoveFromWishlist = (product) => {
    dispatch(removeFromWishlist(product.Id))
    toast.success(`Removed ${product.name} from wishlist`)
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ApperIcon name="Heart" size={64} className="text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-display font-bold text-primary mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love by clicking the heart icon. You'll find them here when you're ready to buy.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-primary text-surface rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </motion.div>

        {/* Wishlist Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {wishlistItems.map((product, index) => {
            const discountPercentage = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            )

            return (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/product/${product.Id}`} className="block">
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Sale Badge */}
                    {discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                        -{discountPercentage}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold text-primary">
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <ApperIcon
                            key={i}
                            name={i < Math.floor(product.rating) ? "Star" : "Star"}
                            size={12}
                            className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.reviews?.length || 0})
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Remove from Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleRemoveFromWishlist(product)
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 group/btn"
                >
                  <ApperIcon 
                    name="Heart" 
                    size={16} 
                    className="text-red-500 fill-current group-hover/btn:scale-110 transition-transform" 
                  />
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

export default Wishlist