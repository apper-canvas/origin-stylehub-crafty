import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { orderService } from "@/services/api/orderService"

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError("")
      const orderData = await orderService.getById(orderId)
      setOrder(orderData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrder()
  }, [orderId])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadOrder} />
  if (!order) return <Error message="Order not found" />

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="CheckCircle" size={40} className="text-green-600" />
          </div>
          
          <h1 className="text-4xl font-display font-bold text-primary mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase
          </p>
          
          <p className="text-lg text-gray-500">
            Order #{order.Id} • Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-surface rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-primary mb-6">Order Details</h2>
            
            <div className="space-y-4">
{order.items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-primary">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.size && `Size: ${item.size}`} 
                      {item.color && ` • Color: ${item.color}`} 
                      • Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-accent mb-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Link
                      to={`/reviews?productId=${item.productId}`}
                      className="inline-flex items-center gap-1 text-sm text-accent hover:underline font-medium"
                    >
                      <ApperIcon name="Star" size={14} />
                      Write a Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-secondary mt-6 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${order.shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-secondary pt-2 mt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-accent">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping & Billing */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Shipping Information */}
            <div className="bg-surface rounded-lg p-6">
              <h3 className="font-semibold text-primary mb-4">Shipping Address</h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-primary">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p className="mt-2">{order.shippingAddress.email}</p>
                {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-surface rounded-lg p-6">
              <h3 className="font-semibold text-primary mb-4">Payment Method</h3>
              <div className="text-sm text-gray-600">
                <p>{order.paymentMethod}</p>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-surface rounded-lg p-6">
              <h3 className="font-semibold text-primary mb-4">Estimated Delivery</h3>
              <div className="flex items-center gap-3">
                <ApperIcon name="Truck" size={20} className="text-green-600" />
                <div>
                  <p className="font-medium text-primary">
                    {format(new Date(order.estimatedDelivery), "EEEE, MMMM d")}
                  </p>
                  <p className="text-sm text-gray-600">Standard shipping (5-7 business days)</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-surface rounded-lg p-6 mb-8"
        >
          <h3 className="font-semibold text-primary mb-6">Order Status</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Check" size={16} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-primary">Order Confirmed</p>
                <p className="text-sm text-gray-600">We've received your order</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {format(new Date(order.createdAt), "MMM d, h:mm a")}
            </span>
          </div>

          <div className="w-0.5 h-8 bg-gray-200 ml-4 my-2"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Package" size={16} className="text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-400">Processing</p>
                <p className="text-sm text-gray-500">We're preparing your items</p>
              </div>
            </div>
          </div>

          <div className="w-0.5 h-8 bg-gray-200 ml-4 my-2"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Truck" size={16} className="text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-400">Shipped</p>
                <p className="text-sm text-gray-500">Your order is on the way</p>
              </div>
            </div>
          </div>

          <div className="w-0.5 h-8 bg-gray-200 ml-4 my-2"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Home" size={16} className="text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-400">Delivered</p>
                <p className="text-sm text-gray-500">Package delivered</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-3 bg-accent text-surface rounded-md hover:bg-accent/90 transition-colors font-medium"
            >
              <ApperIcon name="ArrowRight" size={16} className="mr-2" />
              Continue Shopping
            </Link>
            
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-8 py-3 bg-transparent text-primary border-2 border-primary rounded-md hover:bg-primary hover:text-surface transition-colors font-medium"
            >
              <ApperIcon name="Printer" size={16} className="mr-2" />
              Print Receipt
            </button>
          </div>

          <p className="text-sm text-gray-600">
            Questions about your order? <a href="#" className="text-accent hover:text-accent/80">Contact Support</a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderConfirmation