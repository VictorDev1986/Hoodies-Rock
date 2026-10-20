import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import {
  brands as catalogBrands,
  categories as catalogCategories,
  products as catalogProducts,
} from "../src/data/mock-products"

const pool = new Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

async function main() {
  console.log("Seeding database...")

  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.address.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.user.deleteMany()

  const categories: Record<string, string> = {}
  for (const category of catalogCategories) {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
      },
    })
    categories[category.slug] = created.id
  }
  console.log(`Created ${catalogCategories.length} categories`)

  const brands: Record<string, string> = {}
  for (const brand of catalogBrands) {
    const created = await prisma.brand.create({
      data: {
        name: brand.name,
        slug: slugify(brand.name),
      },
    })
    brands[brand.name] = created.id
  }
  console.log(`Created ${catalogBrands.length} brands`)

  for (const product of catalogProducts) {
    const categoryId = categories[product.category]
    const brandId = brands[product.brand]

    if (!categoryId || !brandId) {
      throw new Error(
        `Invalid catalog reference for product "${product.name}": category=${product.category}, brand=${product.brand}`
      )
    }

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        genre: product.genre,
        otherGenre: product.otherGenre,
        price: product.price,
        comparePrice: product.originalPrice,
        stock: product.stock,
        images: product.images,
        specs: product.specs,
        isNew: product.isNew,
        isFeatured: product.isFeatured,
        categoryId,
        brandId,
      },
    })
  }
  console.log(`Created ${catalogProducts.length} products`)

  const adminUser = await prisma.user.create({
    data: {
      email: "Victyone@gmail.com",
      password: "$2b$10$h62DAtVIXrpJIHUabwDp4e2egPSlWDXgQjHEafgPUlSasCqQlSb8u",
      name: "Admin User",
      phone: "+51 999 888 777",
      role: "ADMIN",
      status: "ACTIVE",
    },
  })
  console.log(`Created admin user: ${adminUser.email}`)

  const customerUser = await prisma.user.create({
    data: {
      email: "juan@email.com",
      password: "$2b$10$FKVSla3Hq5n3IKFbOFcoFOZnxhfYEf21Eco/iRtUtrFjTcFQhpKFG",
      name: "Juan Perez",
      phone: "+51 987 654 321",
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  })
  console.log(`Created customer user: ${customerUser.email}`)

  await prisma.address.create({
    data: {
      label: "Casa",
      name: "Juan Perez",
      phone: "+51 987 654 321",
      address: "Av. Javier Prado 1234",
      city: "Lima",
      state: "Lima",
      zipCode: "15036",
      isDefault: true,
      userId: customerUser.id,
    },
  })
  console.log("Created address for customer")
  console.log("Seed completed!")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
