import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Admin user
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const pass = process.env.ADMIN_PASSWORD || 'Admin@123';
  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({ name: 'Admin', email, password: pass, role: 'admin' });
    console.log('Admin created:', email);
  } else {
    // ensure role is admin
    admin.role = 'admin';
    await admin.save();
    console.log('Admin ensured:', email);
  }

  // Products
  const dataPath = path.join(__dirname, 'sampleProducts.json');
  const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products.`);

  await mongoose.disconnect();
  console.log('Seed complete.');
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
