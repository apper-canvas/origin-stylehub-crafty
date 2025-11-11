import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ type = "products", message, actionText = "Start Shopping", actionLink = "/shop" }) => {
  const getIcon = () => {
    switch (type) {
      case "cart":
        return "ShoppingBag"
      case "search":
        return "Search"
      case "wishlist":
        return "Heart"
      default:
        return "Package"
    }
  }

  const getDefaultMessage = () => {
    switch (type) {
      case "cart":
        return "Your cart is empty. Ready to find your next favorite piece?"
      case "search":
        return "No products found matching your search. Try different keywords or browse our collections."
      case "wishlist":
        return "Your wishlist is empty. Start adding items you love!"
      default:
        return "No products available at the moment. Check back soon for new arrivals!"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-gray-300 mb-6">
        <ApperIcon name={getIcon()} size={64} />
      </div>
      
      <h3 className="text-xl font-semibold text-primary mb-3">
        {type === "cart" ? "Your Cart is Empty" : 
         type === "search" ? "No Results Found" :
         type === "wishlist" ? "No Saved Items" :
         "No Products Found"}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {message || getDefaultMessage()}
      </p>
      
      <Link
        to={actionLink}
        className="inline-flex items-center px-6 py-3 bg-accent text-surface rounded-md hover:bg-accent/90 transition-colors font-medium"
      >
        <ApperIcon name="ArrowRight" size={16} className="mr-2" />
        {actionText}
      </Link>
    </div>
  )
}

export default Empty