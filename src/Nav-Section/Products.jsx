import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useProducts } from '../hooks/UserProducts';
import ProductCard from './ProductCard';
import ProductList from './ProductList';
import ProductsFilter from './ProductsFilter';
import ProductsToolbar from './ProductsToolbar';
import ProductsPagination from './ProductsPagination';

// Main Component
const Products = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
    search: '',
    category: 'all',
    sortBy: 'latest',
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    onSale: false,
  });

  const { products, categories, ratings, priceRanges, loading: apiLoading, error } = useProducts(filters);
  const [loading, setLoading] = useState(apiLoading);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setLoading(true);
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearchChange = (searchTerm) => handleFilterChange('search', searchTerm);

  const handlePageChange = (page) => {
    setLoading(true);
    setFilters(prev => ({ ...prev, page }));
  };

  const handleClearFilters = () => {
    setLoading(true);
    setFilters({
      page: 1,
      limit: 6,
      search: '',
      category: 'all',
      sortBy: 'latest',
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      onSale: false,
    });
  };

// const filteredProducts = useMemo(() => {
//   return products.filter(p => {
//     if (filters.category !== 'all' && p.category !== filters.category) return false;
//     if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
//     return true;
//   });
// }, [products, filters]);

  // Pagination
 const filteredProducts = useMemo(() => {
  return products.filter(p => {
    // Category filter
    if (filters.category !== 'all' && p.category !== filters.category) return false;
    // Search filter
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    // Price Range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const price = parseFloat(p.price);
      const [minPrice, maxPrice] = filters.priceRange;
      if (price < minPrice || price > maxPrice) return false;
    }
    // Additional filters (rating, inStock, onSale) can be added here
    return true;
  });
}, [products, filters]);
 
 
 
  const startIndex = (filters.page - 1) * filters.limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + filters.limit);
  const totalPages = Math.ceil(filteredProducts.length / filters.limit);

  const productCountText = useMemo(() => {
    const start = startIndex + 1;
    const end = Math.min(startIndex + filters.limit, filteredProducts.length);
    return `Showing ${start} - ${end} of ${filteredProducts.length} products`;
  }, [startIndex, filters.limit, filteredProducts]);

  // Stop loading when products update
  useEffect(() => {
    setLoading(false);
  }, [paginatedProducts]);

  return (
    <div className="min-h-screen pt-[65px] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader title="Baby Products" description="Discover the best products for your little one" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 hidden lg:block">
            <ProductsFilter
              filters={filters}
              categories={categories || []}
              ratings={ratings || []}
              priceRanges={priceRanges || []}
              searchTerm={filters.search}
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="lg:col-span-3">
            <ProductsToolbar
              currentCount={paginatedProducts.length}
              totalCount={filteredProducts.length}
              viewMode={viewMode}
              sortBy={filters.sortBy}
              onViewModeChange={setViewMode}
              onSortChange={(value) => handleFilterChange('sortBy', value)}
              onShowFilters={() => setShowFilters(true)}
            />

            {loading ? (
              <ProductsLoading />
            ) : error ? (
              <ProductsError message={error} />
            ) : (
              <>
                <ProductsList products={paginatedProducts} viewMode={viewMode} onClearFilters={handleClearFilters} />

                <ProductsPagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} />

                <div className="text-center text-gray-600 mt-4 text-sm">{productCountText}</div>
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <MobileFiltersModal
            filters={filters}
            categories={categories || []}
            searchTerm={filters.search}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onClose={() => setShowFilters(false)}
            onClearFilters={handleClearFilters}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-components
const PageHeader = ({ title, description }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-600 text-lg">{description}</p>
  </div>
);

const MobileFiltersModal = ({ filters, categories, searchTerm, onFilterChange, onSearchChange, onClose, onClearFilters }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }} className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <ProductsFilter
          filters={filters}
          categories={categories}
          ratings={ratings}
          priceRanges={priceRanges}
          searchTerm={searchTerm}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onClearFilters={onClearFilters}
        />
      </div>
    </motion.div>
  </motion.div>
);

const ProductsList = ({ products, viewMode, onClearFilters }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😢</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
        <button onClick={onClearFilters} className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors">Clear All Filters</button>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            {viewMode === 'grid' ? <ProductCard product={product} /> : <ProductList product={product} />}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const ProductsLoading = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
      <p className="text-gray-500">Loading products...</p>
    </div>
  </div>
);

const ProductsError = ({ message }) => (
  <div className="min-h-[400px] flex flex-col items-center justify-center text-red-500">
    <div className="text-4xl mb-4">⚠️</div>
    <p className="text-lg font-semibold mb-2">Error loading products</p>
    <p className="text-sm">{message}</p>
  </div>
);

export default Products;
