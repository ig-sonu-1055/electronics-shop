import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiTruck, FiGlobe, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './About.css';

const About = () => {
  const stats = [
    { icon: <FiUsers />, value: '50K+', label: 'Happy Customers' },
    { icon: <FiAward />, value: '100+', label: 'Top Brands' },
    { icon: <FiTruck />, value: '10K+', label: 'Orders Delivered' },
    { icon: <FiGlobe />, value: '25+', label: 'Countries Served' },
  ];

  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    },
    {
      name: 'Mike Chen',
      role: 'Tech Director',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    {
      name: 'Emily Davis',
      role: 'Customer Success',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We partner only with top brands to ensure every product meets the highest standards.',
    },
    {
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We go above and beyond to exceed expectations.',
    },
    {
      title: 'Innovation',
      description: 'We stay ahead of trends to bring you the latest and greatest in technology.',
    },
    {
      title: 'Integrity',
      description: 'Honest pricing, transparent policies, and genuine customer relationships.',
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>About ElectroShop</h1>
          <p>Your trusted destination for premium electronics since 2020</p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <motion.div 
              className="story-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2>Our Story</h2>
              <p>
                ElectroShop was founded with a simple mission: to make premium electronics 
                accessible to everyone. What started as a small online store has grown into 
                a leading e-commerce platform serving customers worldwide.
              </p>
              <p>
                We believe that technology should enhance lives, not complicate them. That's 
                why we carefully curate our product selection, ensuring each item meets our 
                high standards for quality, performance, and value.
              </p>
              <p>
                Today, we're proud to serve over 50,000 satisfied customers across 25+ 
                countries, backed by a dedicated team passionate about delivering 
                exceptional experiences.
              </p>
            </motion.div>
            <motion.div 
              className="story-image"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600" 
                alt="Technology" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            className="stats-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-card"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </motion.div>

          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="value-number">0{index + 1}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Meet Our Team</h2>
            <p>The passionate people behind ElectroShop</p>
          </motion.div>

          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                className="team-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Get in Touch</h2>
            <p>Have questions? We'd love to hear from you.</p>
            
            <div className="contact-grid">
              <div className="contact-item">
                <FiMail />
                <span>support@electroshop.com</span>
              </div>
              <div className="contact-item">
                <FiPhone />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FiMapPin />
                <span>123 Tech Street, Silicon Valley</span>
              </div>
            </div>

            <motion.button 
              className="contact-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
