import ApperIcon from "@/components/ApperIcon"

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-red-500 mb-4">
        <ApperIcon name="AlertCircle" size={48} />
      </div>
      
      <h3 className="text-xl font-semibold text-primary mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message || "We encountered an error while loading the content. Please try again."}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-accent text-surface rounded-md hover:bg-accent/90 transition-colors font-medium"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </button>
      )}
    </div>
  )
}

export default Error