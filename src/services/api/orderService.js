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
  }
}