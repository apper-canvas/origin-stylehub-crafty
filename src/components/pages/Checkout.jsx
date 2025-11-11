import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { selectCartItems, selectCartTotal, clearCart } from "@/store/slices/cartSlice"
import { orderService } from "@/services/api/orderService"
import { toast } from "react-toastify"

const Checkout = () => {
  const cartItems = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    // Preferences
    saveInfo: false,
    newsletter: false
  })

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart")
    }
  }, [cartItems.length, navigate])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && 
               formData.address && formData.city && formData.state && formData.zipCode
      case 2:
        return formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardName
      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    } else {
      toast.error("Please fill in all required fields")
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) {
      toast.error("Please complete all required fields")
      return
    }

    setLoading(true)
    try {
      const orderData = {
        items: cartItems,
        subtotal: cartTotal,
        shipping: cartTotal > 100 ? 0 : 8.99,
        tax: cartTotal * 0.09,
        total: cartTotal + (cartTotal > 100 ? 0 : 8.99) + (cartTotal * 0.09),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: "Credit Card"
      }

      const order = await orderService.create(orderData)
      
      dispatch(clearCart())
      toast.success("Order placed successfully!")
      navigate(`/order-confirmation/${order.Id}`)
    } catch (error) {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const estimatedShipping = cartTotal > 100 ? 0 : 8.99
  const estimatedTax = cartTotal * 0.09
  const estimatedTotal = cartTotal + estimatedShipping + estimatedTax

  const steps = [
    { number: 1, title: "Shipping", completed: currentStep > 1 },
    { number: 2, title: "Payment", completed: currentStep > 2 },
    { number: 3, title: "Review", completed: false }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-display font-bold text-primary mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.completed || currentStep === step.number
                      ? "bg-accent border-accent text-surface"
                      : "border-secondary text-gray-400"
                  }`}>
                    {step.completed ? (
                      <ApperIcon name="Check" size={16} />
                    ) : (
                      <span className="font-medium">{step.number}</span>
                    )}
                  </div>
                  <span className={`ml-2 font-medium ${
                    step.completed || currentStep === step.number ? "text-primary" : "text-gray-400"
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      step.completed ? "bg-accent" : "bg-secondary"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-surface rounded-lg p-8"
                >
                  <h2 className="text-xl font-semibold text-primary mb-6">Shipping Information</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Apartment, Suite, etc. (Optional)
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="saveInfo"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-accent border-secondary rounded focus:ring-accent"
                      />
                      <label htmlFor="saveInfo" className="text-sm text-gray-600">
                        Save this information for next time
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-surface rounded-lg p-8"
                >
                  <h2 className="text-xl font-semibold text-primary mb-6">Payment Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        required
                      />
                    </div>

                    <div className="bg-secondary/30 rounded-md p-4 flex items-start gap-3">
                      <ApperIcon name="Shield" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-primary text-sm">Secure Payment</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Your payment information is encrypted and secure. We don't store your card details.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-surface rounded-lg p-8"
                >
                  <h2 className="text-xl font-semibold text-primary mb-6">Review Your Order</h2>
                  
                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-medium text-primary mb-2">Shipping Address</h3>
                      <div className="bg-secondary/20 rounded-md p-4 text-sm">
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        {formData.apartment && <p>{formData.apartment}</p>}
                        <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                        <p>{formData.email}</p>
                        {formData.phone && <p>{formData.phone}</p>}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="font-medium text-primary mb-2">Payment Method</h3>
                      <div className="bg-secondary/20 rounded-md p-4 text-sm">
                        <p>Credit Card ending in {formData.cardNumber.slice(-4)}</p>
                        <p>{formData.cardName}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-medium text-primary mb-2">Order Items</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between items-center py-2">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`} • Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 border border-secondary text-primary rounded-md hover:bg-secondary transition-colors"
                  >
                    <ApperIcon name="ArrowLeft" size={16} className="inline mr-2" />
                    Back
                  </button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-accent text-surface rounded-md hover:bg-accent/90 transition-colors"
                    >
                      Continue
                      <ApperIcon name="ArrowRight" size={16} className="inline ml-2" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitOrder}
                      disabled={loading}
                      className="px-8 py-3 bg-accent text-surface rounded-md hover:bg-accent/90 disabled:opacity-50 transition-colors"
                    >
                      {loading ? (
                        <>
                          <ApperIcon name="Loader2" size={16} className="inline mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="CreditCard" size={16} className="inline mr-2" />
                          Place Order
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-lg p-6 shadow-sm sticky top-8">
                <h2 className="text-xl font-semibold text-primary mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.size && `${item.size} • `}{item.color} • Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-accent">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 border-t border-secondary pt-4">
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
                    <span>Tax</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-secondary pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-accent">${estimatedTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Checkout