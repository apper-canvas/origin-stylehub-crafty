import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const FilterSidebar = ({ isOpen, onClose, filters, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 1000])

  const categories = [
    { id: "women", name: "Women", count: 45 },
    { id: "men", name: "Men", count: 38 },
    { id: "accessories", name: "Accessories", count: 22 },
    { id: "shoes", name: "Shoes", count: 31 },
  ]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const colors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Gray", hex: "#8B8B8B" },
    { name: "Navy", hex: "#1F2937" },
    { name: "Brown", hex: "#8B4513" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Red", hex: "#EF4444" },
    { name: "Blue", hex: "#3B82F6" },
  ]

  const handleCategoryChange = (categoryId) => {
    const newCategories = filters.categories?.includes(categoryId)
      ? filters.categories.filter(cat => cat !== categoryId)
      : [...(filters.categories || []), categoryId]
    onFilterChange({ ...filters, categories: newCategories })
  }

  const handleSizeChange = (size) => {
    const newSizes = filters.sizes?.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...(filters.sizes || []), size]
    onFilterChange({ ...filters, sizes: newSizes })
  }

  const handleColorChange = (color) => {
    const newColors = filters.colors?.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...(filters.colors || []), color]
    onFilterChange({ ...filters, colors: newColors })
  }

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange)
    onFilterChange({ ...filters, minPrice: newRange[0], maxPrice: newRange[1] })
  }

  const clearFilters = () => {
    setPriceRange([0, 1000])
    onFilterChange({})
  }

  const FilterSection = ({ title, children, isCollapsible = true }) => {
    const [isExpanded, setIsExpanded] = useState(true)

    return (
      <div className="border-b border-secondary pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        {isCollapsible ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full mb-4 text-left"
          >
            <h3 className="font-medium text-primary">{title}</h3>
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </button>
        ) : (
          <h3 className="font-medium text-primary mb-4">{title}</h3>
        )}
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-secondary lg:hidden">
        <h2 className="text-lg font-medium text-primary">Filters</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-secondary rounded-md transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </button>
      </div>

      {/* Filters Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Clear Filters */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-primary hidden lg:block">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Categories */}
        <FilterSection title="Categories">
          <div className="space-y-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category.id) || false}
                  onChange={() => handleCategoryChange(category.id)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                  filters.categories?.includes(category.id)
                    ? "bg-accent border-accent"
                    : "border-gray-300"
                }`}>
                  {filters.categories?.includes(category.id) && (
                    <ApperIcon name="Check" size={12} className="text-surface" />
                  )}
                </div>
                <span className="text-sm text-primary flex-1">{category.name}</span>
                <span className="text-xs text-gray-500">({category.count})</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>
            <div className="text-center text-sm text-gray-600">
              ${priceRange[0]} - ${priceRange[1]}
            </div>
          </div>
        </FilterSection>

        {/* Sizes */}
        <FilterSection title="Sizes">
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`py-2 px-3 text-sm border rounded-md transition-colors ${
                  filters.sizes?.includes(size)
                    ? "bg-accent text-surface border-accent"
                    : "border-secondary text-primary hover:border-accent"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Colors */}
        <FilterSection title="Colors">
          <div className="grid grid-cols-4 gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.name)}
                className={`w-10 h-10 rounded-full border-2 relative ${
                  filters.colors?.includes(color.name)
                    ? "border-accent"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {filters.colors?.includes(color.name) && (
                  <ApperIcon 
                    name="Check" 
                    size={16} 
                    className={`absolute inset-0 m-auto ${
                      color.name === "White" ? "text-primary" : "text-surface"
                    }`} 
                  />
                )}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-surface border-r border-secondary h-full">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 bg-surface shadow-2xl z-50 lg:hidden flex flex-col"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default FilterSidebar