"use client";
import styles from "../scss/SpeedTest.module.scss";
import { useCallback, useMemo, useRef, useState } from "react";
import { testDownload, testLatency, testUpload } from "@/lib/speedTest";
import { useLang } from "contexts/LanguageContext";

function fmt(n: number, digits = 1) {
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export default function SpeedTest() {
  const { t } = useLang();
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState(t("ready"));
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [latency, setLatency] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const totalPlan = 100_000_000 + 40_000_000;
  const downloadedRef = useRef(0);
  const uploadedRef = useRef(0);

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setDone(false);
    setStatus(t("measuring"));
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

    setStatus(t("testingDownload"));
    const down = await testDownload({
      onProgress: (b) => {
        downloadedRef.current = b;
        setProgress((downloadedRef.current + uploadedRef.current) / totalPlan);
      },
    });
    setDownload(down);

    setStatus(t("testingUpload"));
    const up = await testUpload({
      onProgress: (b) => {
        uploadedRef.current = b;
        setProgress((downloadedRef.current + uploadedRef.current) / totalPlan);
      },
    });
    setUpload(up);

    setStatus(t("done"));
    setRunning(false);
    setDone(true);
  }, [running, totalPlan, t]);

  const progressPct = useMemo(
    () => Math.min(100, Math.round(progress * 100)),
    [progress]
  );

  const getSummary = () => {
    let summaryKey = "summarySlow";
    if (download > 200 && upload > 100) summaryKey = "summaryFast";
    else if (download > 50 && upload > 20) summaryKey = "summaryGood";

    return (
      <>
        <p>
          {t("latency")}: {fmt(latency, 0)} ms
        </p>
        <p>{t("server")}</p>
        <p>{t(summaryKey)}</p>
      </>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className="card">
        <div className="header">
          <h2>{t("title")}</h2>
        </div>
        <p className="subtitle">{t("subtitle1")}</p>
        <p className="subtitle">{t("subtitle2")}</p>

        <div className="grid">
          <div className="metric">
            <h3>{t("download")}</h3>
            <div className="value">
              {fmt(download)} <small>Mbps</small>
            </div>
          </div>
          <div className="metric">
            <h3>{t("upload")}</h3>
            <div className="value">
              {fmt(upload)} <small>Mbps</small>
            </div>
          </div>
          <div className="metric small">
            <h3>{t("latency")}</h3>
            <div className="value">
              {fmt(latency, 0)} <small>ms</small>
            </div>
          </div>
          <div className="metric small">
            <h3>{t("jitter")}</h3>
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
            {t("start")}
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
              setStatus(t("ready"));
              setDone(false);
            }}
          >
            {t("reset")}
          </button>
        </div>

        {done && <div className="summary">{getSummary()}</div>}
      </div>
    </div>
  );
}
