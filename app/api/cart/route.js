import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET all products
export async function GET() {
    try {
        const client = await clientPromise;
        const db = await client.db("mydb");
        const products = await db.collection("cart").find().toArray();
        return NextResponse.json(products);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST create product
export async function POST(req) {
    try {
        const body = await req.json();
        console.log(body)
        // ✅ You decide validation rules here
        if (!body) {
            return NextResponse.json({ error: "body is undefined" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = await client.db("mydb");
        const result = await db.collection("cart").insertOne(body);

        return NextResponse.json(result, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;
        console.log(id)
        if (!id) {
            return NextResponse.json({ error: "id required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("mydb");
        const { ObjectId } = require('mongodb');

        const result = await db.collection("cart").deleteOne({ _id:new ObjectId(id) })


        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
