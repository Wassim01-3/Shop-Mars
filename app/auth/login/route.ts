import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Find the user
    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Compare passwords
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    // Set cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
  }
}
