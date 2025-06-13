import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Get a specific product by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

// Update a product
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const json = await request.json()

    const product = await db.product.update({
      where: { id: params.id },
      data: {
        name: json.name,
        description: json.description,
        price: json.price,
        imageUrl: json.imageUrl,
        category: json.category,
        inventory: json.inventory,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// Delete a product
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await db.product.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
