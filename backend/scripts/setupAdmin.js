const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI?.trim();
const adminName = process.env.ADMIN_NAME || 'SJ ELECTRO Admin';
const adminEmail = (process.env.ADMIN_EMAIL || 'admin@sjelectro.com').trim().toLowerCase();
const adminPassword = (process.env.ADMIN_PASSWORD || 'Admin@123').trim();

async function setupAdmin() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in backend/.env');
  }

  if (adminPassword.length < 6) {
    throw new Error('ADMIN_PASSWORD must be at least 6 characters long');
  }

  await mongoose.connect(MONGODB_URI);

  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    existing.name = adminName;
    existing.role = 'admin';
    existing.status = 'active';
    existing.isActive = true;
    existing.password = adminPassword;
    await existing.save();

    console.log('Admin user updated successfully');
  } else {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      status: 'active',
      isActive: true,
    });

    console.log('Admin user created successfully');
  }

  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
}

setupAdmin()
  .catch((error) => {
    console.error(`Failed to setup admin: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
