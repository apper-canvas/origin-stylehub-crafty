import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import ProductCard from "@/components/molecules/ProductCard"
import FilterSidebar from "@/components/molecules/FilterSidebar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { productService } from "@/services/api/productService"

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState("")

  // Initialize filters from URL params
  const getFiltersFromURL = () => {
    return {
      search: searchParams.get("search") || "",
      categories: searchParams.get("category") ? [searchParams.get("category")] : [],
      sizes: searchParams.getAll("size"),
      colors: searchParams.getAll("color"),
      minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")) : undefined,
      sale: searchParams.get("sale") === "true",
      collection: searchParams.get("collection") || ""
    }
  }

  const [filters, setFilters] = useState(getFiltersFromURL())

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError("")
      const fetchedProducts = await productService.getAll({ ...filters, sortBy })
      setProducts(fetchedProducts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [filters, sortBy])

  useEffect(() => {
    setFilters(getFiltersFromURL())
  }, [searchParams])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    
    // Update URL params
    const params = new URLSearchParams()
    if (newFilters.search) params.set("search", newFilters.search)
    if (newFilters.categories?.length) {
      newFilters.categories.forEach(cat => params.append("category", cat))
    }
    if (newFilters.sizes?.length) {
      newFilters.sizes.forEach(size => params.append("size", size))
    }
    if (newFilters.colors?.length) {
      newFilters.colors.forEach(color => params.append("color", color))
    }
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice.toString())
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice.toString())
    if (newFilters.sale) params.set("sale", "true")
    if (newFilters.collection) params.set("collection", newFilters.collection)
    
    setSearchParams(params)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
  }

  const sortOptions = [
    { value: "", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name A-Z" },
    { value: "rating", label: "Highest Rated" }
  ]

  const getPageTitle = () => {
    if (filters.search) return `Search results for "${filters.search}"`
    if (filters.categories?.length === 1) {
      const categoryName = filters.categories[0].charAt(0).toUpperCase() + filters.categories[0].slice(1)
      return `${categoryName}'s Fashion`
    }
    if (filters.sale) return "Sale Items"
    if (filters.collection === "featured") return "Featured Collection"
    return "All Products"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              {getPageTitle()}
            </h1>
            {!loading && (
              <p className="text-gray-600">
                {products.length} {products.length === 1 ? "product" : "products"} found
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden inline-flex items-center px-4 py-2 bg-surface text-primary border border-secondary rounded-md hover:bg-secondary transition-colors"
            >
              <ApperIcon name="Filter" size={16} className="mr-2" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-surface text-primary border border-secondary rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ApperIcon 
                name="ChevronDown" 
                size={16} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <Loading />
            ) : error ? (
              <Error message={error} onRetry={loadProducts} />
            ) : products.length === 0 ? (
              <Empty 
                type="search" 
                message={filters.search ? `No products found for "${filters.search}"` : "No products match your filters"} 
                actionText="Clear Filters"
                actionLink="/shop"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop