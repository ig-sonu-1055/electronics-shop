import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { FiTruck, FiShield, FiHeadphones, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

import 'swiper/css';
import 'swiper/css/navigation';
import './Home.css';

const Home = () => {
  const { products, categories } = useProducts();
  const featuredProducts = products.filter(p => p.featured);
  const newArrivals = products.slice(0, 8);

  const features = [
    { icon: <FiTruck />, title: 'Free Shipping', description: 'On orders over ₹8,217' },
    { icon: <FiShield />, title: 'Secure Payment', description: '100% secure transactions' },
    { icon: <FiHeadphones />, title: '24/7 Support', description: 'Dedicated support team' },
    { icon: <FiRefreshCw />, title: 'Easy Returns', description: '30-day return policy' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="home">
      <HeroSlider />

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div 
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="feature-card"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Shop by Category</h2>
            <p>Browse our wide selection of electronics</p>
          </motion.div>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={2}
            navigation
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              480: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 8 },
            }}
            className="categories-swiper"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link 
                  to={`/products?category=${category.name}`} 
                  className="category-card"
                >
                  <motion.div 
                    className="category-icon"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.icon}
                  </motion.div>
                  <span className="category-name">{category.name}</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all-link">
              View All <FiArrowRight />
            </Link>
          </motion.div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="banner-section">
        <div className="container">
          <motion.div 
            className="promo-banner"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="banner-content">
              <span className="banner-tag">Limited Time Offer</span>
              <h2>Get 20% Off Your First Order</h2>
              <p>Use code WELCOME20 at checkout and save on premium electronics</p>
              <Link to="/products" className="banner-btn">
                Shop Now <FiArrowRight />
              </Link>
            </div>
            <div className="banner-image">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" 
                alt="Premium Headphones"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="products-section new-arrivals">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>New Arrivals</h2>
            <Link to="/products" className="view-all-link">
              View All <FiArrowRight />
            </Link>
          </motion.div>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="products-swiper"
          >
            {newArrivals.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="newsletter-cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Stay Updated</h2>
            <p>Subscribe for exclusive deals, new arrivals, and tech news</p>
            <form className="cta-form">
              <input type="email" placeholder="Enter your email" />
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
