import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET all products
export async function GET() {
    try {
        const client = await clientPromise;
        const db = await client.db("mydb");
        const products = await db.collection("order").find({}).toArray();
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
            return NextResponse.json({ error: "name and price are required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = await client.db("mydb");
        const result = await db.collection("order").insertOne(body);

        return NextResponse.json(result, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {


        const data = await request.json()
        console.log(data)
        if (!data.status) {
            return NextResponse.json({ "error": "status is missing", data })
        }
        if (!data.orderId) {
            return NextResponse.json({ "error": "ordderId is missing", data })
        }
        const client = await clientPromise;
        const db = await client.db("mydb");
        const result = await db.collection("order").findOneAndUpdate(
            { orderId: data.orderId },
            { $set: { status: data.status } },
            { returnDocument: 'after' }
        );
        return NextResponse.json({ "success": "true", result })
    } catch (error) {
        return NextResponse.json({ "internal server error": error })
        
    }

}