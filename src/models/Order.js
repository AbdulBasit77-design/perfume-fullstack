import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered'], default: 'pending' },
  address: { type: String, required: true },
  paymentMethod: { type: String, default: 'cod' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
