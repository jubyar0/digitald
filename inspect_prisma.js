
const { prisma } = require('./packages/database/src/index.ts');

async function main() {
    console.log('Prisma keys:', Object.keys(prisma));
    // Also check if we can access the model property directly
    console.log('ticketMessage:', prisma.ticketMessage);
    console.log('ticket_message:', prisma.ticket_message);
    console.log('TicketMessage:', prisma.TicketMessage);
}

main().catch(console.error);
