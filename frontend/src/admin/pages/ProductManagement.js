import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiX,
  FiImage,
  FiDollarSign,
  FiPackage,
  FiStar,
  FiChevronDown,
  FiAlertCircle
} from 'react-icons/fi';
import { useProducts } from '../../context/ProductContext';
import { formatINR } from '../../utils/currency';
import './ProductManagement.css';

const ProductManagement = () => {
  const { products, categories, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    rating: 0,
    featured: false
  });

  const categoriesList = ['Smartphones', 'Laptops', 'Tablets', 'Headphones', 'Cameras', 'Gaming', 'Accessories', 'Wearables', 'Smart Home'];

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === 'edit' && product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        image: product.image,
        rating: product.rating,
        featured: product.featured
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image: '',
        rating: 0,
        featured: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      addProduct(formData);
    } else {
      updateProduct(selectedProduct.id, formData);
    }
    
    handleCloseModal();
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    deleteProduct(productToDelete.id);
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from products
  const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const allCategories = [...new Set([...categoriesList, ...uniqueCategories])];

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loader"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-management">
      <div className="page-header">
        <div className="header-text">
          <h1>Product Management</h1>
          <p>Manage your store products</p>
        </div>
        <motion.button 
          className="add-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal('add')}
        >
          <FiPlus /> Add Product
        </motion.button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FiFilter />
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <FiChevronDown className="select-arrow" />
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td>
                  <div className="product-cell">
                    <img src={product.image} alt={product.name} />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>
                  <span className="category-badge">{product.category}</span>
                </td>
                <td className="price-cell">{formatINR(product.price)}</td>
                <td>
                  <span className={`stock-badge ${product.stock < 20 ? 'low' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <div className="rating-cell">
                    <FiStar className="star-icon" />
                    <span>{product.rating}</span>
                  </div>
                </td>
                <td>
                  <span className={`featured-badge ${product.featured ? 'yes' : 'no'}`}>
                    {product.featured ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="edit-btn"
                      onClick={() => handleOpenModal('edit', product)}
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteClick(product)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <FiPackage />
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div 
              className="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
                <button className="close-modal" onClick={handleCloseModal}>
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <div className="input-wrapper">
                      <FiPackage />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <div className="select-wrapper">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select category</option>
                        {allCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <FiChevronDown />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (INR)</label>
                    <div className="input-wrapper">
                      <FiDollarSign />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <div className="input-wrapper">
                      <FiPackage />
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <div className="input-wrapper">
                    <FiImage />
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description..."
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rating (0-5)</label>
                    <div className="input-wrapper">
                      <FiStar />
                      <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        placeholder="0"
                        step="0.1"
                        min="0"
                        max="5"
                      />
                    </div>
                  </div>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      Featured Product
                    </label>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {modalMode === 'add' ? 'Add Product' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div 
              className="confirm-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="confirm-icon">
                <FiAlertCircle />
              </div>
              <h3>Delete Product</h3>
              <p>Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.</p>
              <div className="confirm-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="delete-confirm-btn"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagement;
