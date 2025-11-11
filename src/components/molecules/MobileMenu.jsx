import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const MobileMenu = ({ isOpen, onClose, categories }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-surface shadow-2xl z-50 md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary">
              <h2 className="text-xl font-display font-bold text-primary">
                Style<span className="text-accent">Hub</span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-md transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-6 space-y-4">
              <Link
                to="/"
                onClick={onClose}
                className="block py-3 text-primary hover:text-accent transition-colors font-medium"
              >
                Home
              </Link>
              
              <div className="space-y-2">
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="block py-3 text-primary hover:text-accent transition-colors font-medium"
                >
                  All Products
                </Link>
                
                <div className="ml-4 space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.path}
                      onClick={onClose}
                      className="block py-2 text-gray-600 hover:text-accent transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link
                to="/shop?collection=featured"
                onClick={onClose}
                className="block py-3 text-primary hover:text-accent transition-colors font-medium"
              >
                Collections
              </Link>
              
              <Link
                to="/shop?sale=true"
                onClick={onClose}
                className="block py-3 text-primary hover:text-accent transition-colors font-medium"
              >
                Sale
              </Link>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu