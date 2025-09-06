export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify({ serverNow: Date.now() }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    },
    status: 200,
  });
}
