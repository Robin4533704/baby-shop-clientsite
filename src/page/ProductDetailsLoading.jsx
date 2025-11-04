import React from "react";

const ProductDetailsLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 md:py-8">
    <div className="max-w-7xl mx-auto px-3 space-y-6 md:space-y-8">
      {/* Back Button Skeleton */}
      <div className="h-10 md:h-12 bg-slate-200 rounded-xl md:rounded-2xl w-28 md:w-32 animate-pulse"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-slate-200 rounded-2xl md:rounded-3xl h-[400px] md:h-[550px] animate-pulse"></div>
          <div className="flex space-x-2 md:space-x-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-slate-200 rounded-xl md:rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Product Info Skeleton */}
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            <div className="h-3 md:h-4 bg-slate-200 rounded w-32 md:w-48 animate-pulse"></div>
            <div className="h-8 md:h-12 bg-slate-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 md:h-6 bg-slate-200 rounded w-24 md:w-32 animate-pulse"></div>
            <div className="h-6 md:h-8 bg-slate-200 rounded w-20 md:w-24 animate-pulse"></div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div className="h-3 md:h-4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-3 md:h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-3 md:h-4 bg-slate-200 rounded w-4/6 animate-pulse"></div>
          </div>
          <div className="h-10 md:h-12 bg-slate-200 rounded w-28 md:w-32 animate-pulse"></div>
          <div className="flex space-x-3 md:space-x-4">
            <div className="h-12 md:h-14 bg-slate-200 rounded flex-1 animate-pulse"></div>
            <div className="h-12 md:h-14 bg-slate-200 rounded w-12 md:w-14 animate-pulse"></div>
            <div className="h-12 md:h-14 bg-slate-200 rounded w-12 md:w-14 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailsLoading;