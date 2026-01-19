import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutFailedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <XCircle className="h-16 w-16 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-600">Payment Failed</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Unfortunately, your payment could not be processed. Please try again or contact support.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button asChild>
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/contact">Contact Support</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
