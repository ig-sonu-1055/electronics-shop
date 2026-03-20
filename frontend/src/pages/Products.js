import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiList, FiFilter, FiX, FiChevronDown, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { formatINR } from '../utils/currency';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { products, categories } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);

  const offerProducts = products.filter((p) => p.featured).slice(0, 4);

  const offerSlides = offerProducts.map((product, index) => ({
    id: product.id,
    title: index % 2 === 0 ? 'Hot Tech Deal' : 'Limited Time Offer',
    subtitle: `${product.name}`,
    highlight: `${Math.max(8, Math.min(35, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)))}% OFF`,
    price: product.price,
    image: product.image,
  }));

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) {
      setSelectedCategory(category);
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!products || products.length === 0) return;
    
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, sortBy, priceRange, searchQuery]);

  useEffect(() => {
    if (offerSlides.length <= 1) return undefined;

    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % offerSlides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [offerSlides.length]);

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };

  return (
    <div className="products-page">
      <div className="products-hero">
        <AnimatePresence mode="wait">
          {offerSlides.length > 0 ? (
            <motion.div
              key={offerSlides[activeBanner].id}
              className="hero-slide-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="hero-slide-content">
                <span className="hero-chip">{offerSlides[activeBanner].title}</span>
                <h1>{offerSlides[activeBanner].subtitle}</h1>
                <p>
                  Save big now: <strong>{offerSlides[activeBanner].highlight}</strong>
                </p>
                <div className="hero-cta-row">
                  <span className="hero-price">Now {formatINR(offerSlides[activeBanner].price)}</span>
                  <button className="hero-shop-btn" onClick={() => setSearchQuery(offerSlides[activeBanner].subtitle)}>
                    Shop This <FiArrowRight />
                  </button>
                </div>
              </div>
              <div className="hero-slide-image-wrap">
                <img src={offerSlides[activeBanner].image} alt={offerSlides[activeBanner].subtitle} className="hero-slide-image" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1>Our Products</h1>
              <p>Discover our wide range of premium electronics</p>
            </motion.div>
          )}
        </AnimatePresence>

        {offerSlides.length > 1 && (
          <div className="hero-dots" role="tablist" aria-label="Offer slides">
            {offerSlides.map((slide, index) => (
              <button
                key={slide.id}
                className={`hero-dot ${activeBanner === index ? 'active' : ''}`}
                onClick={() => setActiveBanner(index)}
                aria-label={`Show offer ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="products-container">
        {/* Mobile Filter Toggle */}
        <button 
          className="mobile-filter-toggle"
          onClick={() => setIsFilterOpen(true)}
        >
          <FiFilter /> Filters
        </button>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {(isFilterOpen || window.innerWidth > 1024) && (
              <motion.aside 
                className={`products-sidebar ${isFilterOpen ? 'open' : ''}`}
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
              >
                <div className="sidebar-header">
                  <h3>Filters</h3>
                  <button 
                    className="close-filter"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <FiX />
                  </button>
                </div>

                {/* Search in filters */}
                <div className="filter-group">
                  <h4>Search</h4>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="filter-search"
                  />
                </div>

                {/* Categories */}
                <div className="filter-group">
                  <h4>Categories</h4>
                  <div className="category-filters">
                    <button
                      className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('All')}
                    >
                      All Products
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        className={`category-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.name)}
                      >
                        {cat.icon} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="filter-group">
                  <h4>Price Range</h4>
                  <div className="price-inputs">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      min="0"
                      max={priceRange[1]}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      min={priceRange[0]}
                      max="5000"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="price-slider"
                  />
                </div>

                <button 
                  className="clear-filters"
                  onClick={() => {
                    setSelectedCategory('All');
                    setPriceRange([0, 5000]);
                    setSearchQuery('');
                  }}
                >
                  Clear All Filters
                </button>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Overlay for mobile */}
          {isFilterOpen && (
            <div 
              className="filter-overlay"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Products Content */}
          <main className="products-content">
            {/* Toolbar */}
            <div className="products-toolbar">
              <div className="results-count">
                Showing <span>{filteredProducts.length}</span> products
              </div>

              <div className="toolbar-actions">
                <div className="sort-dropdown">
                  <FiChevronDown />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                <div className="view-toggles">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <FiGrid />
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div 
                className={`products-grid ${viewMode}`}
                layout
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
