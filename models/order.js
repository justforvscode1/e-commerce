import mongoose,{model,models, Schema} from "mongoose";
const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  orderedItems: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
    selectedVariant: {
      type: Map,
      of: String,
      default: {}
    },
    stockCount: { type: Number, required: true, min: 0 }
  }],
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cod', 'card'], // Only these three
    default: 'cod'
  },
  // PAYMENT FIELDS (Optional for COD, required for stripe/card)
//   paymentMethodId: {
//     type: String,
//     required: function() {
//       return this.paymentMethod !== 'cod'; // Required for stripe/card
//     }
//   },
  stripePaymentIntentId: {
    type: String,
    required: false,
    sparse: true
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'requires_payment_method'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    required: false
  },
  transactionId: {
    type: String,
    required: false,
    sparse: true
  },
  // ORDER FIELDS
  shippingCost: {
    type: Number,
    required: true,
    min: 0
  },
  shippingForm: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    apartment: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
  },
  shippingMethod: {
    type: String,
    required: true,
    enum: ['standard', 'express', 'overnight'],
    default: 'express'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in transit',  'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for production performanc

const Order = models?.Order || model('Order', orderSchema);

export default Order;