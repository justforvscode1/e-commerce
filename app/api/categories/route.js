import dbConnect from "@/lib/mongodb";
import {  NextResponse } from "next/server";
import { Categorie } from "@/models/categories";
export async function GET() {
try {
    
    await dbConnect();
    
    const categories = await Categorie.find({});
    return NextResponse.json(categories, { status: 200 });
    
} catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
}
}
export async function POST(request) {
    try {
        await dbConnect();
        const data = await request.json();
        const newCategory = await Categorie.create(data);
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}