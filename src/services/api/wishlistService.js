// Mock wishlist service using localStorage
class WishlistService {
  constructor() {
    this.storageKey = 'wishlist'
  }

  // Get all wishlist items
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const items = localStorage.getItem(this.storageKey)
          resolve(items ? JSON.parse(items) : [])
        } catch (error) {
          console.error('Error loading wishlist:', error)
          resolve([])
        }
      }, 100)
    })
  }

  // Add item to wishlist
  async add(product) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!product || !product.Id) {
            reject(new Error('Invalid product data'))
            return
          }

          const items = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
          const existingIndex = items.findIndex(item => item.Id === product.Id)
          
          if (existingIndex === -1) {
            items.push(product)
            localStorage.setItem(this.storageKey, JSON.stringify(items))
            resolve(product)
          } else {
            resolve(items[existingIndex])
          }
        } catch (error) {
          console.error('Error adding to wishlist:', error)
          reject(error)
        }
      }, 100)
    })
  }

  // Remove item from wishlist
  async remove(productId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!productId) {
            reject(new Error('Product ID is required'))
            return
          }

          const items = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
          const filteredItems = items.filter(item => item.Id !== productId)
          
          localStorage.setItem(this.storageKey, JSON.stringify(filteredItems))
          resolve(true)
        } catch (error) {
          console.error('Error removing from wishlist:', error)
          reject(error)
        }
      }, 100)
    })
  }

  // Clear all wishlist items
  async clear() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          localStorage.setItem(this.storageKey, JSON.stringify([]))
          resolve(true)
        } catch (error) {
          console.error('Error clearing wishlist:', error)
          reject(error)
        }
      }, 100)
    })
  }

  // Check if product is in wishlist
  async isInWishlist(productId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const items = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
          resolve(items.some(item => item.Id === productId))
        } catch (error) {
          console.error('Error checking wishlist:', error)
          resolve(false)
        }
      }, 100)
    })
  }
}

export const wishlistService = new WishlistService()