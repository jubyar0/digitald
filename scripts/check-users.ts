import { prisma } from '../apps/web/lib/prisma'

async function checkUsers() {
    console.log('Checking test users in database...\n')

    const testEmails = [
        'admin@stock.com',
        'seller@stock.com',
        'customer@stock.com'
    ]

    for (const email of testEmails) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                clerkId: true
            }
        })

        if (user) {
            console.log(`✅ Found: ${email}`)
            console.log(`   Role: ${user.role}`)
            console.log(`   Name: ${user.name || 'N/A'}`)
            console.log(`   ClerkId: ${user.clerkId || 'N/A'}`)
        } else {
            console.log(`❌ Not found: ${email}`)
        }
        console.log('')
    }

    await prisma.$disconnect()
}

checkUsers().catch(console.error)
