'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserStatsProps {
  data: {
    date: string;
    newUsers: number;
    activeUsers: number;
  }[];
}

export function UserStats({ data }: UserStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
        <CardDescription>
          New and active users over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="newUsers" fill="#8884d8" name="New Users" />
              <Bar dataKey="activeUsers" fill="#82ca9d" name="Active Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}