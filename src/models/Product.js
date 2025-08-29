import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String },
  notes: [{ type: String }],
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, default: 'Perfume' },
  image: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
