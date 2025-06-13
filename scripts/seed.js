// This script seeds the database with initial data
import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seeding...")

  // Create admin user
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@shopmars.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@shopmars.com",
      password: adminPassword,
    },
  })
  console.log("Created admin user")

  // Create test user
  const userPassword = await hash("password123", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@example.com",
      password: userPassword,
    },
  })
  console.log("Created test user")

  // Create sample products
  const products = [
    {
      name: "Mars Rover Model",
      description: "A detailed model of the Mars Rover, perfect for space enthusiasts.",
      price: 129.99,
      imageUrl: "/images/mars-rover.jpg",
      category: "models",
      inventory: 50,
    },
    {
      name: "Mars Globe",
      description: "Detailed topographic globe of Mars showing major landmarks and features.",
      price: 79.99,
      imageUrl: "/images/mars-globe.jpg",
      category: "home",
      inventory: 30,
    },
    {
      name: "Mars Expedition T-Shirt",
      description: "Comfortable cotton t-shirt with Mars expedition graphics.",
      price: 24.99,
      imageUrl: "/images/mars-tshirt.jpg",
      category: "clothing",
      inventory: 100,
    },
    {
      name: "Mars Rocks Collection",
      description: "Collection of replica Mars rocks based on actual samples.",
      price: 49.99,
      imageUrl: "/images/mars-rocks.jpg",
      category: "collectibles",
      inventory: 25,
    },
    {
      name: "Mars Survival Guide",
      description: "A fun and informative guide about surviving on Mars.",
      price: 19.99,
      imageUrl: "/images/mars-guide.jpg",
      category: "books",
      inventory: 75,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }
  console.log(`Created ${products.length} products`)

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
