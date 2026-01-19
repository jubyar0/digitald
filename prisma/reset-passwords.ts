import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function resetPasswords() {
    console.log('🔄 Resetting user passwords...\n')

    // Update admin password
    await prisma.user.update({
        where: { email: 'admin@stock.com' },
        data: { password: 'Admin@123' }
    })
    console.log('✅ Admin password reset to: Admin@123')

    // Update seller password
    await prisma.user.update({
        where: { email: 'seller@stock.com' },
        data: { password: 'Seller@123' }
    })
    console.log('✅ Seller password reset to: Seller@123')

    // Update customer password
    await prisma.user.update({
        where: { email: 'customer@stock.com' },
        data: { password: 'Customer@123' }
    })
    console.log('✅ Customer password reset to: Customer@123')

    console.log('\n✨ All passwords have been reset!')
    console.log('\nYou can now login with:')
    console.log('━'.repeat(50))
    console.log('Admin: admin@stock.com / Admin@123')
    console.log('Seller: seller@stock.com / Seller@123')
    console.log('Customer: customer@stock.com / Customer@123')
    console.log('━'.repeat(50))

    await prisma.$disconnect()
}

resetPasswords().catch(console.error)
