import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function checkUsers() {
    console.log('🔍 Checking users in database...\n')

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            password: true,
        }
    })

    console.log(`Found ${users.length} users:\n`)

    users.forEach(user => {
        console.log(`📧 Email: ${user.email}`)
        console.log(`👤 Name: ${user.name}`)
        console.log(`🔑 Role: ${user.role}`)
        console.log(`🔒 Password: ${user.password ? '***' + user.password.slice(-3) : 'NULL'}`)
        console.log('─'.repeat(50))
    })

    await prisma.$disconnect()
}

checkUsers().catch(console.error)
