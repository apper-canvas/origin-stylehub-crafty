import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Empty from "@/components/ui/Empty"
import { 
  selectCartItems, 
  selectCartTotal, 
  removeFromCart, 
  updateQuantity 
} from "@/store/slices/cartSlice"
import { toast } from "react-toastify"

const Cart = () => {
  const cartItems = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const dispatch = useDispatch()

  const handleRemoveItem = (productId, size, color) => {
    dispatch(removeFromCart({ productId, size, color }))
    toast.success("Item removed from cart")
  }

  const handleQuantityChange = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, size, color)
    } else {
      dispatch(updateQuantity({ productId, size, color, quantity }))
    }
  }

  const estimatedShipping = cartTotal > 100 ? 0 : 8.99
  const estimatedTax = cartTotal * 0.09
  const estimatedTotal = cartTotal + estimatedShipping + estimatedTax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-8">Shopping Cart</h1>
          <Empty type="cart" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-display font-bold text-primary mb-8">
            Shopping Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-surface rounded-lg p-6 shadow-sm"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link to={`/product/${item.productId}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-md hover:opacity-80 transition-opacity"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-medium text-primary hover:text-accent transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded border border-secondary hover:bg-secondary transition-colors"
                          >
                            <ApperIcon name="Minus" size={14} />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded border border-secondary hover:bg-secondary transition-colors"
                          >
                            <ApperIcon name="Plus" size={14} />
                          </button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-accent">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-surface rounded-lg p-6 shadow-sm h-fit sticky top-8"
            >
              <h2 className="text-xl font-semibold text-primary mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {estimatedShipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${estimatedShipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                
                {cartTotal < 100 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-800">
                      Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}
                
                <div className="border-t border-secondary pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-accent">${estimatedTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <Link
                  to="/checkout"
                  className="block w-full py-4 bg-accent text-surface text-center rounded-md hover:bg-accent/90 transition-colors font-medium text-lg mt-6"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  to="/shop"
                  className="block w-full py-3 text-center text-primary hover:text-accent transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Cart