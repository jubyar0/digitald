import { NextRequest } from 'next/server';

export async function GET(_request: NextRequest) {
  return new Response(JSON.stringify({ message: 'API route working!' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}