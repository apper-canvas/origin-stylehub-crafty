import productsData from "@/services/mockData/products.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
  async getAll(filters = {}) {
    await delay(300)
    
    let filteredProducts = [...productsData]
    
    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.categories.includes(product.category)
      )
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      )
    }
    
    // Apply price range filter
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice)
    }
    
    // Apply size filter
    if (filters.sizes && filters.sizes.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.sizes && product.sizes.some(size => filters.sizes.includes(size))
      )
    }
    
    // Apply color filter
    if (filters.colors && filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.colors && product.colors.some(color => filters.colors.includes(color.name))
      )
    }
    
    // Apply sale filter
    if (filters.sale) {
      filteredProducts = filteredProducts.filter(product => product.originalPrice > product.price)
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case "name":
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "rating":
          filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        case "newest":
          filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        default:
          break
      }
    }
    
    return filteredProducts
  },

  async getById(id) {
    await delay(200)
    const product = productsData.find(p => p.Id === parseInt(id))
    if (!product) {
      throw new Error("Product not found")
    }
    return { ...product }
  },

  async getFeatured() {
    await delay(250)
    return productsData.filter(product => product.featured).slice(0, 8)
  },

  async getByCategory(category) {
    await delay(300)
    return productsData.filter(product => product.category === category)
  },

  async getRelated(productId, limit = 4) {
    await delay(200)
    const currentProduct = productsData.find(p => p.Id === parseInt(productId))
    if (!currentProduct) return []
    
    return productsData
      .filter(product => 
        product.Id !== parseInt(productId) && 
        product.category === currentProduct.category
      )
      .slice(0, limit)
  }
}