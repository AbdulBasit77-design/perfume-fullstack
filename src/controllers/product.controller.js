import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import fs from "fs";

// Multer setup for temporary file storage
const upload = multer({ dest: "uploads/" });

// List all products with optional search/filter
export const listProducts = async (req, res) => {
  try {
    const { q, brand } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (brand) filter.brand = brand;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list products" });
  }
};

// Get single product by ID
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get product" });
  }
};

// Create product (Admin) with optional image upload
export const createProduct = async (req, res) => {
  try {
    let imageUrl = req.body.image || "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // remove local file
    }

    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      image: imageUrl,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// Update product (Admin) with optional image upload
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      product.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    } else if (req.body.image) {
      product.image = req.body.image;
    }

    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.description = req.body.description || product.description;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.remove();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

export { upload }; // export multer middleware for route usage
