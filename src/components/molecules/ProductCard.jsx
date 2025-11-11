import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from "@/store/slices/wishlistSlice";
import { toast } from "react-toastify";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { addToCart } from "@/store/slices/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch()
  const isInWishlist = useSelector(selectIsInWishlist(product.Id))

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(addToCart({
      productId: product.Id.toString(),
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    }))

    toast.success(`${product.name} added to cart!`)
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
return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
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

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              handleWishlistToggle()
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 group/btn"
          >
            <ApperIcon 
              name="Heart" 
              size={16} 
              className={`transition-all duration-200 group-hover/btn:scale-110 ${
                isInWishlist 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </button>

          {/* Quick Add Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleQuickAdd}
            className="absolute bottom-3 left-3 right-3 bg-primary text-surface py-2 px-4 rounded-md font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/90"
          >
            <ApperIcon name="Plus" size={16} className="inline mr-2" />
            Quick Add
          </motion.button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-primary mb-1 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-accent">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <ApperIcon
                    key={i}
                    name="Star"
                    size={12}
                    className={i < Math.floor(product.rating) 
                      ? "text-accent fill-current" 
                      : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews?.length || 0})
              </span>
            </div>
          )}

          {/* Available Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard