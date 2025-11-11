const Loading = ({ type = "products" }) => {
  const renderProductSkeleton = () => (
    <div className="bg-surface rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-secondary"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-secondary rounded w-3/4"></div>
        <div className="h-3 bg-secondary rounded w-1/2"></div>
        <div className="h-4 bg-secondary rounded w-1/3"></div>
      </div>
    </div>
  )

  const renderDetailSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div className="space-y-4">
        <div className="aspect-square bg-secondary rounded-lg"></div>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-secondary rounded"></div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-8 bg-secondary rounded w-3/4"></div>
        <div className="h-6 bg-secondary rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-secondary rounded"></div>
          <div className="h-4 bg-secondary rounded w-5/6"></div>
        </div>
        <div className="h-12 bg-secondary rounded"></div>
        <div className="h-12 bg-secondary rounded"></div>
      </div>
    </div>
  )

  if (type === "detail") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDetailSkeleton()}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i}>
          {renderProductSkeleton()}
        </div>
      ))}
    </div>
  )
}

export default Loading