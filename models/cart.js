import mongoose, { Schema, model, models } from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    salePrice : {
        type: Number,
        min: 0
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },

    selectedVariant: {
           type: Object,
            required: true
        
    },

    stockCount: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },


}, {
    timestamps: true
});
cartSchema.index({ userId: 1 });
cartSchema.index({ userId: 1, productId: 1 });

const Cart = models?.Cart || model("Cart", cartSchema);
export default Cart;