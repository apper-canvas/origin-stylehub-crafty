import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import ProductCard from "@/components/molecules/ProductCard"
import ReviewCard from "@/components/molecules/ReviewCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { productService } from "@/services/api/productService"
import { reviewService } from "@/services/api/reviewService"
import { addToCart } from "@/store/slices/cartSlice"
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from "@/store/slices/wishlistSlice"
import { toast } from "react-toastify"

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [reviewStats, setReviewStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("reviews")
  const isInWishlist = useSelector(selectIsInWishlist(product?.Id))
const loadProduct = async () => {
    try {
      setLoading(true)
      setError("")
      const [productData, related, productReviews, stats] = await Promise.all([
        productService.getById(id),
        productService.getRelated(id),
        reviewService.getByProductId(id),
        reviewService.getProductStats(id)
      ])
      
      setProduct(productData)
      setRelatedProducts(related)
      setReviews(productReviews)
      setReviewStats(stats)
      
      // Set default selections
      if (productData.sizes?.length > 0) {
        setSelectedSize(productData.sizes[0])
      }
      if (productData.colors?.length > 0) {
        setSelectedColor(productData.colors[0].name)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProduct()
    window.scrollTo(0, 0)
  }, [id])

const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error("Please select a size")
      return
    }
    
    if (!selectedColor && product.colors?.length > 0) {
      toast.error("Please select a color")
      return
    }

    dispatch(addToCart({
      productId: product.Id.toString(),
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
      quantity
    }))
    
    toast.success("Added to cart!")
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.Id))
      toast.success(`Removed ${product.name} from wishlist`)
    } else {
      dispatch(addToWishlist(product))
      toast.success(`Added ${product.name} to wishlist`)
    }
  }

  if (loading) return <Loading type="detail" />
  if (error) return <Error message={error} onRetry={loadProduct} />
  if (!product) return <Error message="Product not found" />

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <ApperIcon name="ChevronRight" size={14} />
          <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
          <ApperIcon name="ChevronRight" size={14} />
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">
                  -{discountPercentage}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-accent" : "border-secondary"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-primary mb-2">
                {product.name}
              </h1>
              
{/* Rating */}
              {reviewStats && reviewStats.totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <ApperIcon
                        key={i}
                        name="Star"
                        size={16}
                        className={i < Math.floor(reviewStats.averageRating) 
                          ? "text-accent fill-current" 
                          : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {reviewStats.averageRating} ({reviewStats.totalReviews} reviews)
                  </span>
                  <a 
                    href="#reviews"
                    className="text-sm text-accent hover:underline ml-1"
                  >
                    See all reviews
                  </a>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-accent">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-primary mb-3">
                  Color: {selectedColor}
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 relative ${
                        selectedColor === color.name ? "border-accent" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <ApperIcon 
                          name="Check" 
                          size={16} 
                          className={`absolute inset-0 m-auto ${
                            color.name === "White" ? "text-primary" : "text-surface"
                          }`} 
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-primary mb-3">
                  Size: {selectedSize}
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 text-sm border rounded-md transition-colors ${
                        selectedSize === size
                          ? "bg-accent text-surface border-accent"
                          : "border-secondary text-primary hover:border-accent"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-primary mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-secondary rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-secondary transition-colors"
                  >
                    <ApperIcon name="Minus" size={16} />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-secondary transition-colors"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  {product.stock > 10 ? (
                    <span className="text-green-600">✓ In Stock</span>
                  ) : product.stock > 0 ? (
                    <span className="text-orange-600">Only {product.stock} left</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-4 bg-accent text-surface rounded-md hover:bg-accent/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                <ApperIcon name="ShoppingBag" size={20} className="inline mr-2" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
<button 
                onClick={handleWishlistToggle}
                className={`w-full py-4 border-2 rounded-md transition-colors font-medium text-lg ${
                  isInWishlist 
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600' 
                    : 'bg-transparent text-primary border-primary hover:bg-primary hover:text-surface'
                }`}
              >
                <ApperIcon 
                  name="Heart" 
                  size={20} 
                  className={`inline mr-2 transition-all ${
                    isInWishlist ? 'fill-current' : ''
                  }`} 
                />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t border-secondary pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Truck" size={16} className="text-green-600" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="RotateCcw" size={16} className="text-blue-600" />
                  <span>Free 30-day returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Shield" size={16} className="text-purple-600" />
                  <span>2-year warranty</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

{/* Reviews Section */}
        <section id="reviews" className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold text-primary mb-8 text-center">
              Customer Reviews
            </h2>

            {reviewStats && reviewStats.totalReviews > 0 ? (
              <>
                {/* Review Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {reviewStats.averageRating}
                    </div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <ApperIcon
                          key={i}
                          name="Star"
                          size={20}
                          className={i < Math.floor(reviewStats.averageRating) 
                            ? "text-accent fill-current" 
                            : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">
                      Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="max-w-md mx-auto">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2 mb-2">
                        <span className="text-sm w-8">{rating}</span>
                        <ApperIcon name="Star" size={14} className="text-accent fill-current" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full"
                            style={{
                              width: `${reviewStats.totalReviews > 0 ? (reviewStats.ratingBreakdown[rating] / reviewStats.totalReviews) * 100 : 0}%`
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {reviewStats.ratingBreakdown[rating]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.slice(0, 5).map((review, index) => (
                    <ReviewCard key={review.Id} review={review} index={index} />
                  ))}
                  
                  {reviews.length > 5 && (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        Showing 5 of {reviews.length} reviews
                      </p>
                      {/* In a real app, this would show all reviews or paginate */}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="MessageSquare" size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Reviews Yet</h3>
                <p className="text-gray-500 mb-6">
                  Be the first to review this product and help other customers make their decision.
                </p>
              </div>
            )}
          </motion.div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-primary mb-8 text-center">
                You Might Also Like
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.Id} product={relatedProduct} />
                ))}
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetail