import { NextRequest } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const sizeParam = url.searchParams.get('size');
  const chunkParam = url.searchParams.get('chunk');
  const size = Math.max(1, Math.min(Number(sizeParam ?? 50_000_000), 2_000_000_000)); // default 50MB
  const chunk = Math.max(1024, Math.min(Number(chunkParam ?? 1_048_576), 8_388_608)); // default 1MB

  let sent = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      const remaining = size - sent;
      if (remaining <= 0) {
        controller.close();
        return;
      }
      const len = Math.min(chunk, remaining);
      const buf = crypto.randomBytes(len);
      controller.enqueue(buf);
      sent += len;
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
