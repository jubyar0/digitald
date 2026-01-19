import { Role, ProductStatus, OrderStatus, DisputeStatus, TicketStatus } from '@prisma/client'
import { prisma } from '../apps/web/lib/prisma'

async function main() {
  console.log('Start seeding ...')

  // 1. Create Users
  const adminEmail = 'admin@example.com'
  const sellerEmail = 'seller@example.com'
  const customerEmail = 'customer@example.com'

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      role: Role.ADMIN,
      password: 'password123', // In real app, this should be hashed
      adminAccount: {
        create: {
          permissions: { all: true },
          isSuperAdmin: true
        }
      }
    },
  })

  const seller = await prisma.user.upsert({
    where: { email: sellerEmail },
    update: {},
    create: {
      email: sellerEmail,
      name: 'Seller User',
      role: Role.VENDOR,
      password: 'password123',
    },
  })

  const customer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {},
    create: {
      email: customerEmail,
      name: 'Customer User',
      role: Role.CUSTOMER,
      password: 'password123',
    },
  })

  console.log('Users created.')

  // 2. Create Vendor
  const vendor = await prisma.vendor.upsert({
    where: { userId: seller.id },
    update: {},
    create: {
      userId: seller.id,
      name: 'Awesome Vendor',
      description: 'Best digital products in town',
      status: 'APPROVED', // Assuming status field exists or default is fine. Wait, schema has VendorApplication.
      // Vendor model doesn't have status, but VendorApplication does.
    },
  })

  // Create Vendor Application if not exists
  await prisma.vendorApplication.upsert({
    where: { vendorId: vendor.id },
    update: {},
    create: {
      vendorId: vendor.id,
      status: 'APPROVED',
      reviewedBy: admin.id,
      reviewedAt: new Date(),
    }
  })

  console.log('Vendor created.')

  // 3. Create Categories
  const category = await prisma.category.upsert({
    where: { slug: '3d-models' },
    update: {},
    create: {
      name: '3D Models',
      slug: '3d-models',
    },
  })

  console.log('Category created.')

  // 4. Create Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Sci-Fi Character Model',
      description: 'High quality 3D model of a sci-fi character.',
      price: 49.99,
      categoryId: category.id,
      vendorId: vendor.id,
      fileUrl: 'https://example.com/file.zip',
      status: ProductStatus.PUBLISHED,
      thumbnail: 'https://placehold.co/600x400',
    },
  })

  const product2 = await prisma.product.create({
    data: {
      name: 'Fantasy Weapon Pack',
      description: 'A collection of fantasy weapons.',
      price: 29.99,
      categoryId: category.id,
      vendorId: vendor.id,
      fileUrl: 'https://example.com/weapons.zip',
      status: ProductStatus.PENDING,
      thumbnail: 'https://placehold.co/600x400',
    },
  })

  console.log('Products created.')

  // 5. Create Orders
  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      vendorId: vendor.id,
      totalAmount: 49.99,
      status: OrderStatus.PAID,
      items: {
        create: {
          productId: product1.id,
          quantity: 1,
          price: 49.99,
        },
      },
    },
  })

  console.log('Order created.')

  // 6. Create Dispute
  await prisma.dispute.create({
    data: {
      orderId: order.id,
      productId: product1.id,
      initiatorId: customer.id,
      reason: 'File corrupted',
      status: DisputeStatus.PENDING,
    },
  })

  console.log('Dispute created.')

  // 7. Create Review
  await prisma.review.create({
    data: {
      userId: customer.id,
      productId: product1.id,
      rating: 4,
      comment: 'Great model, but textures could be better.',
    },
  })

  console.log('Review created.')

  // 8. Create Support Ticket
  await prisma.supportTicket.create({
    data: {
      userId: customer.id,
      subject: 'Download issue',
      description: 'I cannot download the file I purchased.',
      category: 'Technical',
      status: TicketStatus.OPEN,
    },
  })

  console.log('Support ticket created.')

  // 9. Create Settings
  await prisma.setting.upsert({
    where: { key: 'site_name' },
    update: {},
    create: {
      key: 'site_name',
      value: 'Digital Marketplace',
      group: 'general'
    }
  })

  await prisma.platformSetting.create({
    data: {
      platformFeePercent: 10,
      cryptoPaymentEnabled: true,
    }
  })

  console.log('Settings created.')

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })