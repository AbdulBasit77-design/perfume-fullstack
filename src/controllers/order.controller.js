import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  const { items, address, paymentMethod } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'No items' });
  // Calculate total from DB prices to prevent tampering
  const productIds = items.map(i => i.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const priceMap = Object.fromEntries(products.map(p => [String(p._id), p.price]));
  let total = 0;
  const normalized = items.map(i => {
    const price = priceMap[String(i.product)];
    if (!price) throw new Error('Invalid product in cart');
    total += price * i.qty;
    return { product: i.product, qty: i.qty, price };
  });
  const order = await Order.create({ user: req.user._id, items: normalized, total, status: 'pending', address, paymentMethod: paymentMethod || 'cod' });
  res.status(201).json(order);
};

export const myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.product');
  res.json(orders);
};

export const listOrders = async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email').populate('items.product');
  res.json(orders);
};

export const setStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};
