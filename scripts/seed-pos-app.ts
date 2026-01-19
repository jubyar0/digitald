import { prisma } from '../packages/database/src'

async function main() {
    console.log('Seeding POS App...')

    const posApp = await prisma.app.upsert({
        where: { slug: 'clikom-pos' },
        update: {},
        create: {
            name: 'Clikom POS',
            slug: 'clikom-pos',
            description: 'A simple Point of Sale system for your physical store. Manage sales, inventory, and customers in one place.',
            shortDescription: 'Point of Sale System',
            icon: 'https://cdn-icons-png.flaticon.com/512/2697/2697430.png', // Placeholder icon
            status: 'APPROVED',
            category: 'sales',
            pricingType: 'free',
            createdByAdmin: true,
            permissions: {
                create: [
                    { permission: 'read_products', description: 'View your products' },
                    { permission: 'write_orders', description: 'Create orders' },
                    { permission: 'read_customers', description: 'View customers' }
                ]
            }
        }
    })

    console.log(`Created/Updated App: ${posApp.name} (${posApp.id})`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
