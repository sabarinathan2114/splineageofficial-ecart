{
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Admin who added it
  name: { type: String, required: true },
  image: { type: String, required: true },
  images: [String], // Additional images
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  reviews: [
    {
      name: String,
      rating: Number,
      comment: String,
      user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
    }
  ],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  // For variants (Size, Color) - Optional Advanced Feature
  variants: [
    {
      type: String, // e.g., "Large", "Red"
      countInStock: Number
    }
  ]
}