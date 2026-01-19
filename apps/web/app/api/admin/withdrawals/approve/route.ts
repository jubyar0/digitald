import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { approveWithdrawal } from '@/actions/admin';

export async function POST(req: NextRequest) {
    try {
        const session = await getCurrentSession();

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { withdrawalId } = await req.json();

        if (!withdrawalId) {
            return NextResponse.json({ error: 'Withdrawal ID is required' }, { status: 400 });
        }

        const result = await approveWithdrawal(withdrawalId, session.user.id);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error approving withdrawal:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
