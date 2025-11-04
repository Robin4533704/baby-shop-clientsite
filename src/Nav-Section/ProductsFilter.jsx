// components/ProductsFilter.jsx
import React, { useMemo } from 'react';
import { Search, X, Star } from 'lucide-react';

const ProductsFilter = ({
  filters,
  categories = [],
  searchTerm = '',
  onFilterChange,
  onSearchChange,
  onClearFilters
}) => {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safePriceRange = Array.isArray(filters.priceRange) ? filters.priceRange : [0, 1000];

  const priceLabels = [
    { label: 'Under $25', range: [0, 25] },
    { label: '$25 - $50', range: [25, 50] },
    { label: '$50 - $100', range: [50, 100] },
    { label: 'Over $100', range: [100, 1000] }
  ];

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 4, label: '4+ Stars' },
    { value: 3, label: '3+ Stars' },
    { value: 2, label: '2+ Stars' }
  ];

  const isCustomPriceRange = useMemo(() => {
    return !priceLabels.some(price =>
      safePriceRange[0] === price.range[0] &&
      safePriceRange[1] === price.range[1]
    );
  }, [safePriceRange]);

  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' ||
           filters.category !== 'all' ||
           filters.rating > 0 ||
           filters.inStock ||
           filters.onSale ||
           isCustomPriceRange;
  }, [filters, isCustomPriceRange]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors flex items-center"
          >
            Clear All
            <X className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Products
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <label className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="category"
                value="all"
                checked={filters.category === 'all'}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                All Categories
              </span>
            </div>
          </label>
          {safeCategories.length > 0 ? (
            categories.map((category) => (
              <label key={category._id || category.value} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.value || category._id}
                    checked={filters.category === (category.value || category._id)}
                    onChange={(e) => onFilterChange('category', e.target.value)}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors capitalize">
                    {category.name || category.label}
                  </span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {category.count || 0}
                </span>
              </label>
            ))
          ) : (
            <div className="text-sm text-gray-500">Loading categories...</div>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceLabels.map((price, index) => (
            <label key={index} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                checked={
                  safePriceRange[0] === price.range[0] &&
                  safePriceRange[1] === price.range[1]
                }
                onChange={() => onFilterChange('priceRange', price.range)}
                className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-600">{price.label}</span>
            </label>
          ))}
        </div>

        {/* Custom Price Range */}
        <div className="mt-4 space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="priceRange"
              checked={isCustomPriceRange}
              onChange={() => {}}
              className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-600">Custom Range</span>
          </label>
          
          <div className="flex items-center space-x-2 ml-6">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Min</label>
              <input
                type="number"
                value={safePriceRange[0]}
                onChange={(e) => onFilterChange('priceRange', [Math.max(0, parseInt(e.target.value) || 0), safePriceRange[1]])}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-pink-500 focus:border-transparent"
                min="0"
              />
            </div>
            <span className="text-gray-400 pt-4">-</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Max</label>
              <input
                type="number"
                value={safePriceRange[1]}
                onChange={(e) => onFilterChange('priceRange', [safePriceRange[0], Math.max(safePriceRange[0] + 1, parseInt(e.target.value) || 1000)])}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-pink-500 focus:border-transparent"
                min={safePriceRange[0] + 1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={option.value}
                checked={filters.rating === option.value}
                onChange={(e) => onFilterChange('rating', parseInt(e.target.value))}
                className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
              />
              <div className="ml-3 flex items-center">
                {option.value > 0 ? (
                  <>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= option.value ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">& Up</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-600">{option.label}</span>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) => onFilterChange('inStock', e.target.checked)}
            className="w-4 h-4 text-pink-600 focus:ring-pink-500 rounded border-gray-300"
          />
          <span className="ml-3 text-sm text-gray-600">In Stock Only</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onSale || false}
            onChange={(e) => onFilterChange('onSale', e.target.checked)}
            className="w-4 h-4 text-pink-600 focus:ring-pink-500 rounded border-gray-300"
          />
          <span className="ml-3 text-sm text-gray-600">On Sale</span>
        </label>
      </div>
    </div>
  );
};

export default ProductsFilter;