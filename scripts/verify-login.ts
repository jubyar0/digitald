import { prisma } from '../apps/web/lib/prisma'
import bcrypt from 'bcryptjs'
import fs from 'fs'

async function main() {
    const log = (msg: string) => {
        console.log(msg)
        fs.appendFileSync('verification-output.txt', msg + '\n')
    }

    fs.writeFileSync('verification-output.txt', 'Starting verification...\n')

    const email = 'seller@example.com'
    const password = 'password123'

    log(`Verifying user: ${email}`)

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            log('User not found!')
            return
        }

        log(`User found: ${user.id}`)
        log(`Role: ${user.role}`)
        log(`Stored Hash: ${user.password}`)

        if (!user.password) {
            log('No password set for user!')
            return
        }

        const isMatch = await bcrypt.compare(password, user.password)
        log(`Password Match: ${isMatch}`)
    } catch (e) {
        log(`Error: ${e}`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        fs.appendFileSync('verification-output.txt', `Fatal Error: ${e}\n`)
    })
    .finally(() => prisma.$disconnect())
