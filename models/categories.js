import { Schema, model, models } from "mongoose";

const categorieSchema = new Schema({
    name: { type: String, required: true },               // e.g. "Laptops"
    parent: { type: String, default: null },              // null = top-level category
    count: { type: Number, default: 0 },                  // product count
    description: { type: String },
    image: { type: String },
}, { timestamps: true });
