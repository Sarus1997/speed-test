function mbps(bytesPerSecond: number): number {
  return (bytesPerSecond * 8) / 1_000_000;
}

export async function testLatency(samples = 10): Promise<{ latencyMs: number; jitterMs: number }> {
  const rtts: number[] = [];
  for (let i = 0; i < samples; i++) {
    const t0 = performance.now();
    const res = await fetch(`/api/ping?i=${i}`, { cache: 'no-store' });
    await res.json();
    const t1 = performance.now();
    rtts.push(t1 - t0);
  }
  const mean = rtts.reduce((a, b) => a + b, 0) / rtts.length;
  const diffs = rtts.map(v => Math.abs(v - mean));
  const jitter = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  return { latencyMs: Math.round(mean), jitterMs: Math.round(jitter) };
}

export async function testDownload({
  targetBytes = 100_000_000,
  concurrency = 3,
  chunk = 1_048_576,
  onProgress,
}: {
  targetBytes?: number;
  concurrency?: number;
  chunk?: number;
  onProgress?: (bytes: number) => void;
}): Promise<number> {
  let downloaded = 0;
  const start = performance.now();

  async function worker(): Promise<void> {
    while (downloaded < targetBytes) {
      const remaining = targetBytes - downloaded;
      const size = Math.min(remaining, 10_000_000);
      const res = await fetch(`/api/download?size=${size}&chunk=${chunk}`, { cache: 'no-store' });
      const reader = res.body!.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        downloaded += value!.byteLength;
        onProgress?.(downloaded);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  const seconds = (performance.now() - start) / 1000;
  return mbps(downloaded / seconds);
}

export async function testUpload({
  targetBytes = 40_000_000,
  partSize = 2_000_000,
  concurrency = 2,
  onProgress,
}: {
  targetBytes?: number;
  partSize?: number;
  concurrency?: number;
  onProgress?: (bytes: number) => void;
}): Promise<number> {
  const payload = new Uint8Array(partSize);

  // ✅ ใช้ crypto ฝั่ง browser ถ้ามี
  if (typeof window !== 'undefined' && window.crypto) {
    const max = 65536; // 64KB ต่อครั้ง
    for (let i = 0; i < payload.length; i += max) {
      const slice = payload.subarray(i, i + max);
      window.crypto.getRandomValues(slice);
    }
  } else {
    const { randomFillSync } = await import('crypto');
    randomFillSync(payload);
  }


  let uploaded = 0;
  const start = performance.now();

  async function worker(): Promise<void> {
    while (uploaded < targetBytes) {
      const remaining = targetBytes - uploaded;
      const size = Math.min(remaining, partSize);
      const body = size === partSize ? payload : payload.slice(0, size);
      await fetch('/api/upload', {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/octet-stream' },
        cache: 'no-store',
      });
      uploaded += size;
      onProgress?.(uploaded);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  const seconds = (performance.now() - start) / 1000;
  return mbps(uploaded / seconds);
}
