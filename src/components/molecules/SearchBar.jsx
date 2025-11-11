import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ onSearch, autoFocus = false }) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        className="w-64 pl-10 pr-4 py-2 border border-secondary rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-background text-sm"
      />
      <ApperIcon 
        name="Search" 
        size={18} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-colors"
      >
        <ApperIcon name="ArrowRight" size={14} />
      </button>
    </form>
  )
}

export default SearchBar