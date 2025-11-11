import ordersData from "@/services/mockData/orders.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const orderService = {
  // Get orders for a specific user
  async getUserOrders(userEmail) {
    await delay(300)
    return ordersData.filter(order => order.userEmail === userEmail)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  // Get order by ID
  async getById(id) {
    await delay(200)
    const order = ordersData.find(order => order.Id === parseInt(id))
    if (!order) {
      throw new Error("Order not found")
    }
    return { ...order }
  },

  // Check if user has purchased a product
  async hasPurchased(userEmail, productId) {
    await delay(150)
    const userOrders = ordersData.filter(order => order.userEmail === userEmail)
    
    return userOrders.some(order => 
order.items.some(item => item.productId === parseInt(productId))
    )
  },

  // Create a new order
  async create(orderData) {
    await delay(500)
    
    // Generate new ID
    const maxId = ordersData.length > 0 ? Math.max(...ordersData.map(o => o.Id)) : 0
    const newId = maxId + 1
    
    // Create order object
    const newOrder = {
      Id: newId,
      userEmail: orderData.shippingAddress.email,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      items: orderData.items.map(item => ({
        productId: item.Id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod
    }
    
    // Add to mock data (in real app, this would be API call)
    ordersData.push(newOrder)
    
    return { ...newOrder }
  }
}