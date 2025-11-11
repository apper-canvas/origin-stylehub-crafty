import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-9xl font-display font-bold text-accent mb-4">404</div>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-primary mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Don't worry, even the best fashionistas sometimes take a wrong turn. 
            Let's get you back to discovering amazing styles.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 bg-accent text-surface rounded-md hover:bg-accent/90 transition-colors font-medium text-lg"
            >
              <ApperIcon name="Home" size={20} className="mr-2" />
              Go Home
            </Link>
            
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-4 bg-transparent text-primary border-2 border-primary rounded-md hover:bg-primary hover:text-surface transition-colors font-medium text-lg"
            >
              <ApperIcon name="ShoppingBag" size={20} className="mr-2" />
              Browse Products
            </Link>
          </div>
          
          <div className="text-center text-gray-500">
            or <Link to="/shop" className="text-accent hover:text-accent/80 underline">explore our collections</Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent rounded-full blur-3xl opacity-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl opacity-5"></div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound