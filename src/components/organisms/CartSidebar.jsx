import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { 
  selectCartItems, 
  selectCartTotal, 
  selectIsCartOpen, 
  closeCart, 
  removeFromCart, 
  updateQuantity 
} from "@/store/slices/cartSlice"
import { toast } from "react-toastify"

const CartSidebar = () => {
  const cartItems = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const isCartOpen = useSelector(selectIsCartOpen)
  const dispatch = useDispatch()

  const handleRemoveItem = (productId, size, color) => {
    dispatch(removeFromCart({ productId, size, color }))
    toast.success("Item removed from cart")
  }

  const handleQuantityChange = (productId, size, color, quantity) => {
    dispatch(updateQuantity({ productId, size, color, quantity }))
  }

  const handleCheckout = () => {
    dispatch(closeCart())
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => dispatch(closeCart())}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary">
              <h2 className="text-xl font-display font-semibold text-primary">
                Shopping Cart
              </h2>
              <button
                onClick={() => dispatch(closeCart())}
                className="p-2 hover:bg-secondary rounded-md transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="ShoppingBag" size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link
                    to="/shop"
                    onClick={() => dispatch(closeCart())}
                    className="inline-flex items-center px-6 py-3 bg-primary text-surface rounded-md hover:bg-primary/90 transition-colors font-medium"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 p-4 bg-background rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-primary truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="font-semibold text-accent">
                          ${item.price.toFixed(2)}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
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
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-secondary p-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-accent">${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="space-y-3">
                  <Link
                    to="/cart"
                    onClick={handleCheckout}
                    className="block w-full py-3 px-4 bg-secondary text-primary text-center rounded-md hover:bg-secondary/80 transition-colors font-medium"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={handleCheckout}
                    className="block w-full py-3 px-4 bg-accent text-surface text-center rounded-md hover:bg-accent/90 transition-colors font-medium"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartSidebar