{
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [
    {
      name: String,
      qty: Number,
      image: String,
      price: Number, // Snapshot price
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }
    }
  ],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: { type: String, required: true }, // 'Stripe', 'Razorpay', 'COD'
  paymentResult: { // From Payment Gateway
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: Date
}