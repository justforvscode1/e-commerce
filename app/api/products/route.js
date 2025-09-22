import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET all products
export async function GET() {
    try {
        const client = await clientPromise;
        const db = await client.db("mydb");
        const products = await db.collection("products").find().toArray();
        return NextResponse.json(products);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST create product
export async function POST(req) {
    try {
        const body = await req.json();
        // ✅ You decide validation rules here
        if (!body) {
            return NextResponse.json({ error: "name and price are required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = await client.db("mydb");
        const result = await db.collection("products").insertOne(body);

        return NextResponse.json(result, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
