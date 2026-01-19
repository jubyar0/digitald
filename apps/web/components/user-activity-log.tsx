'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  device?: string;
  location?: string;
}

interface UserActivityLogProps {
  logs: ActivityLog[];
}

export function UserActivityLog({ logs }: UserActivityLogProps) {
  const getActionBadge = (action: string) => {
    if (action.includes('login') || action.includes('Login')) {
      return <Badge variant="default">Login</Badge>;
    }
    if (action.includes('order') || action.includes('Order')) {
      return <Badge variant="secondary">Order</Badge>;
    }
    if (action.includes('payment') || action.includes('Payment')) {
      return <Badge variant="outline">Payment</Badge>;
    }
    if (action.includes('profile') || action.includes('Profile')) {
      return <Badge variant="outline">Profile</Badge>;
    }
    return <Badge variant="secondary">{action}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>
          Recent user activities and login history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {getActionBadge(log.action)}
                    <div className="mt-1 text-sm">{log.action}</div>
                  </TableCell>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>{log.device || 'Unknown'}</TableCell>
                  <TableCell>{log.location || 'Unknown'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No activity logs found for this user
          </div>
        )}
      </CardContent>
    </Card>
  );
}