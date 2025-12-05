import { Schema, model, models } from "mongoose";

const categorieSchema = new Schema({
    name: { type: String, required: true },          //like sports     
    items: [ {type: String, required: true} ],     //crickrt etc        
    description: { type: String },
    image: { type: String },
}, { timestamps: true });

const Categorie = models.Categorie || model("Categorie", categorieSchema);


export default Categorie ;