import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

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
        const { _id, ...cleanbody } = body
        console.log(body)
        const client = await clientPromise;
        const db = await client.db("mydb");
        // ✅ You decide validation rules here
        if (!body) {
            return NextResponse.json({ error: "body is undefined" }, { status: 400 });
        }
        const repeated = await db.collection("cart").findOne({ name: cleanbody.name })
        if (repeated) {
            return NextResponse.json("already added");

        } else {
            const result = await db.collection("cart").insertOne(cleanbody);

            return NextResponse.json(result, { status: 201 })
        }
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
export async function DELETE(req) {
    try {
        const client = await clientPromise;
        const db = await client.db("mydb");
        const body = await req.json();
        const { id, userId } = body;
        console.log(id)
        if (userId) {
            const results = await db.collection("cart").deleteMany({ userID:userId })
            return NextResponse.json({ results: "cart is cleared" }, { status: 200 });
        }


        const result = await db.collection("cart").deleteOne({ id: id })


        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
