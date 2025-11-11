import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import { orderService } from "@/services/api/orderService"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { toast } from "react-toastify"

const OrderTracking = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (orderId) {
      loadOrder()
    }
  }, [orderId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError("")
      const orderData = await orderService.getById(orderId)
      setOrder(orderData)
    } catch (err) {
      setError("Order not found or failed to load. Please check the order ID and try again.")
      toast.error("Failed to load order details")
    } finally {
      setLoading(false)
    }
  }

  const getStatusStep = (currentStatus) => {
    const steps = ['confirmed', 'processing', 'shipped', 'delivered']
    return steps.indexOf(currentStatus) + 1
  }

  const isStepComplete = (stepStatus, currentStatus) => {
    const steps = ['confirmed', 'processing', 'shipped', 'delivered']
    const stepIndex = steps.indexOf(stepStatus)
    const currentIndex = steps.indexOf(currentStatus)
    return stepIndex <= currentIndex
  }

  const isStepActive = (stepStatus, currentStatus) => {
    return stepStatus === currentStatus
  }

  const getStepIcon = (stepStatus) => {
    switch (stepStatus) {
      case "confirmed":
        return "Check"
      case "processing":
        return "Package"
      case "shipped":
        return "Truck"
      case "delivered":
        return "Home"
      default:
        return "Clock"
    }
  }

  const getStepTitle = (stepStatus) => {
    switch (stepStatus) {
      case "confirmed":
        return "Order Confirmed"
      case "processing":
        return "Processing"
      case "shipped":
        return "Shipped"
      case "delivered":
        return "Delivered"
      default:
        return "Pending"
    }
  }

  const getStepDescription = (stepStatus) => {
    switch (stepStatus) {
      case "confirmed":
        return "We've received your order"
      case "processing":
        return "We're preparing your items"
      case "shipped":
        return "Your order is on the way"
      case "delivered":
        return "Package delivered"
      default:
        return "Awaiting update"
    }
  }

  const getEstimatedDelivery = (createdAt, status) => {
    const orderDate = new Date(createdAt)
    let deliveryDate = new Date(orderDate)
    
    switch (status) {
      case "confirmed":
        deliveryDate.setDate(orderDate.getDate() + 7)
        break
      case "processing":
        deliveryDate.setDate(orderDate.getDate() + 5)
        break
      case "shipped":
        deliveryDate.setDate(orderDate.getDate() + 2)
        break
      case "delivered":
        return "Delivered"
      default:
        deliveryDate.setDate(orderDate.getDate() + 7)
    }
    
    return format(deliveryDate, "MMM d, yyyy")
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadOrder} />
  if (!order) return <Error message="Order not found" onRetry={() => navigate('/orders')} />

  const statusSteps = ['confirmed', 'processing', 'shipped', 'delivered']

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/orders')}
              className="p-2 rounded-md text-primary hover:bg-secondary transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-display font-bold text-primary">Order Tracking</h1>
              <p className="text-gray-600">Order #{order.Id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface rounded-lg shadow-sm border border-secondary">
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold text-primary">
                {format(new Date(order.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="font-semibold text-primary">
                {getEstimatedDelivery(order.createdAt, order.status)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold text-primary">${order.total.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Status Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface rounded-lg shadow-sm border border-secondary p-6"
          >
            <h2 className="text-xl font-display font-semibold text-primary mb-6">Order Status</h2>
            
            <div className="space-y-6">
              {statusSteps.map((stepStatus, index) => {
                const isComplete = isStepComplete(stepStatus, order.status)
                const isActive = isStepActive(stepStatus, order.status)
                
                return (
                  <div key={stepStatus} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isComplete 
                          ? 'bg-green-100 text-green-600' 
                          : isActive
                          ? 'bg-accent text-surface'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <ApperIcon name={getStepIcon(stepStatus)} size={16} />
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-8 mt-2 ${
                          isComplete ? 'bg-green-200' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${
                            isComplete || isActive ? 'text-primary' : 'text-gray-400'
                          }`}>
                            {getStepTitle(stepStatus)}
                          </p>
                          <p className={`text-sm ${
                            isComplete || isActive ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {getStepDescription(stepStatus)}
                          </p>
                        </div>
                        
                        {isActive && (
                          <span className="text-xs text-gray-500">
                            {format(new Date(order.createdAt), "MMM d, h:mm a")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface rounded-lg shadow-sm border border-secondary p-6"
          >
            <h2 className="text-xl font-display font-semibold text-primary mb-6">Order Items</h2>
            
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-3 border border-secondary rounded-lg"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package" size={24} className="text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-primary truncate">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} • ${item.price.toFixed(2)} each
                    </p>
                    {item.size && (
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-sm text-gray-500">Color: {item.color}</p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t border-secondary">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-primary">${(order.total - 10).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-primary">$10.00</span>
                </div>
                <div className="flex justify-between font-semibold text-primary pt-2 border-t border-secondary">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-surface rounded-lg shadow-sm border border-secondary p-6"
          >
            <h2 className="text-xl font-display font-semibold text-primary mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/orders"
            className="inline-flex items-center justify-center px-6 py-3 border border-secondary text-primary rounded-md hover:bg-secondary transition-colors font-medium"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Orders
          </Link>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(`Order #${order.Id}`)
              toast.success("Order number copied to clipboard")
            }}
            className="inline-flex items-center justify-center px-6 py-3 bg-accent text-surface rounded-md hover:bg-accent/90 transition-colors font-medium"
          >
            <ApperIcon name="Copy" size={16} className="mr-2" />
            Copy Order Number
          </button>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent text-surface rounded-md hover:bg-accent/90 transition-colors font-medium"
          >
            <ApperIcon name="ShoppingBag" size={16} className="mr-2" />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderTracking