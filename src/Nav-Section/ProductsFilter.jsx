import React, { useMemo, useEffect, useState } from 'react'; 
import { Search, X, Star } from 'lucide-react';

const ProductsFilter = ({
  filters = {},
  categories = [],
  priceRanges = [],
  ratings = [],
  searchTerm = '',
  onFilterChange,
  onSearchChange,
  onClearFilters
}) => {
  const [customPrice, setCustomPrice] = useState(filters.priceRange || [0, 1000]);

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safePriceRange = Array.isArray(filters.priceRange) ? filters.priceRange : [0, 10000];

  const filteredPriceRanges = useMemo(() => {
    return Array.isArray(priceRanges) ? priceRanges.filter(p => Array.isArray(p.range) && p.range.length === 2) : [];
  }, [priceRanges]);

  const isCustomPriceRange = useMemo(() => {
    return !filteredPriceRanges.some(price =>
      safePriceRange[0] === price.range[0] &&
      safePriceRange[1] === price.range[1]
    );
  }, [safePriceRange, filteredPriceRanges]);

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.search || '') !== '' ||
      (filters.category || 'all') !== 'all' ||
      (filters.rating || 0) > 0 ||
      filters.inStock ||
      filters.onSale ||
      isCustomPriceRange
    );
  }, [filters, isCustomPriceRange]);

  const handleCustomPriceChange = (index, value) => {
    const updated = [...customPrice];
    updated[index] = Number(value);
    setCustomPrice(updated);
  };

  const applyCustomPrice = () => onFilterChange('priceRange', customPrice);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors flex items-center">
            Clear All <X className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
          />
          {searchTerm && (
            <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <label className="flex items-center cursor-pointer">
            <input type="radio" name="category" value="all" checked={(filters.category || 'all') === 'all'} onChange={e => onFilterChange('category', e.target.value)} className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300" />
            <span className="ml-3 text-sm text-gray-600">All Categories</span>
          </label>
          {safeCategories.map(c => (
            <label key={c.value} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input type="radio" name="category" value={c.value} checked={filters.category === c.value} onChange={e => onFilterChange('category', e.target.value)} className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300" />
                <span className="ml-3 text-sm text-gray-600 capitalize">{c.label}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{c.count || 0}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
        <div className="space-y-2">
          {filteredPriceRanges.map((p, i) => (
            <label key={i} className="flex items-center cursor-pointer">
              <input type="radio" name="priceRange" checked={safePriceRange[0] === p.range[0] && safePriceRange[1] === p.range[1]} onChange={() => onFilterChange('priceRange', p.range)} className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300" />
              <span className="ml-3 text-sm text-gray-600">{p.label}</span>
            </label>
          ))}
          <div className="flex space-x-2 mt-2">
            <input type="number" value={customPrice[0]} onChange={e => handleCustomPriceChange(0, e.target.value)} placeholder="Min" className="w-1/2 border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-pink-500" />
            <input type="number" value={customPrice[1]} onChange={e => handleCustomPriceChange(1, e.target.value)} placeholder="Max" className="w-1/2 border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-pink-500" />
            <button onClick={applyCustomPrice} className="bg-pink-600 text-white px-3 py-1 rounded-lg hover:bg-pink-700 transition-colors">Apply</button>
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Rating</h3>
        <div className="space-y-2">
        {ratings.map(r => (
  <label key={r.value} className="flex items-center cursor-pointer">
    <input
      type="radio"
      name="rating"
      value={r.value}
      checked={filters.rating === r.value}
      onChange={() => onFilterChange('rating', r.value)}
      className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
    />
    <span className="ml-3 text-sm text-gray-600 flex items-center">
      {r.label} {r.value > 0 && <Star className="w-4 h-4 text-yellow-400 ml-1" />}
    </span>
  </label>
))}

        </div>
      </div>
    </div>
  );
};

export default ProductsFilter;
