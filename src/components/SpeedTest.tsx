"use client";
import styles from "../scss/SpeedTest.module.scss";
import { useCallback, useMemo, useRef, useState } from "react";
import { testDownload, testLatency, testUpload } from "@/lib/speedTest";

function fmt(n: number, digits = 1) {
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export default function SpeedTest() {
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [latency, setLatency] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [progress, setProgress] = useState(0);

  const totalPlan = 100_000_000 + 40_000_000;
  const downloadedRef = useRef(0);
  const uploadedRef = useRef(0);

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setStatus("Measuring latency...");
    setProgress(0);
    setDownload(0);
    setUpload(0);
    setLatency(0);
    setJitter(0);
    downloadedRef.current = 0;
    uploadedRef.current = 0;

    const lat = await testLatency(10);
    setLatency(lat.latencyMs);
    setJitter(lat.jitterMs);

    setStatus("Testing download speed...");
    const down = await testDownload({
      onProgress: (b) => {
        downloadedRef.current = b;
        setProgress((downloadedRef.current + uploadedRef.current) / totalPlan);
      },
    });
    setDownload(down);

    setStatus("Testing upload speed...");
    const up = await testUpload({
      onProgress: (b) => {
        uploadedRef.current = b;
        setProgress((downloadedRef.current + uploadedRef.current) / totalPlan);
      },
    });
    setUpload(up);

    setStatus("Done");
    setRunning(false);
  }, [running, totalPlan]);

  const progressPct = useMemo(
    () => Math.min(100, Math.round(progress * 100)),
    [progress]
  );

  return (
    <div className={styles.wrapper}>
      <div className="card">
        <div className="header">
          <h2>ทดสอบความเร็วอินเตอร์เน็ต</h2>
        </div>
        <p className="subtitle">
          วัดการดาวน์โหลด การอัปโหลด ความหน่วง
          และความสั่นไหวโดยตรงจากเซิร์ฟเวอร์ของคุณ
        </p>

        <p className="subtitle">
          หมายเหตุ: ถ้าโหลดช้า แสดงว่าเน็ตมึงกาก ทดทบกับเครื่องของมึงเอง
          ไม่ใช้ผ่าน <strong>Server กลางใดๆ</strong> ทั้งสิ้น
        </p>

        <div className="grid">
          <div className="metric">
            <h3>Download</h3>
            <div className="value">
              {fmt(download)} <small>Mbps</small>
            </div>
          </div>
          <div className="metric">
            <h3>Upload</h3>
            <div className="value">
              {fmt(upload)} <small>Mbps</small>
            </div>
          </div>
          <div className="metric small">
            <h3>Latency</h3>
            <div className="value">
              {fmt(latency, 0)} <small>ms</small>
            </div>
          </div>
          <div className="metric small">
            <h3>Jitter</h3>
            <div className="value">
              {fmt(jitter, 0)} <small>ms</small>
            </div>
          </div>
        </div>

        <div className="status">{status}</div>
        <div className="progress">
          <div style={{ width: `${progressPct}%` }} />
        </div>

        <div className="actions">
          <button className="primary" disabled={running} onClick={run}>
            Start test
          </button>
          <button
            className="ghost"
            disabled={running}
            onClick={() => {
              setDownload(0);
              setUpload(0);
              setLatency(0);
              setJitter(0);
              setProgress(0);
              setStatus("Ready");
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
