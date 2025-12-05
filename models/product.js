import { Schema, models, model } from "mongoose"

const productSchema = new Schema({
  productid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  productType: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  variants: {
    type: [{
      attributes: {
        type: Map,
        of: String,
        required: true
      },
      price: { type: Number, required: true },
      stockCount: { type: Number, required: true, min: 0 },
      salePrice: { type: Number },
      images: [{ type: String }],
      sku: { type: String, required: true }
    }],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one variant is required"
    }
  }
}, {
  timestamps: true
});

const Product = models.Product || model("Product", productSchema);
export default Product;