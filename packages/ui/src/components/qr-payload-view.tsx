'use client';

import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';

type QrPayloadViewProps = {
  payload: string;
  alt: string;
  expiresAt?: string | null;
};

function formatExpiry(expiresAt: string) {
  const timestamp = Date.parse(expiresAt);
  if (Number.isNaN(timestamp)) {
    return 'Unknown';
  }

  const remainingMs = timestamp - Date.now();
  if (remainingMs <= 0) {
    return 'Expired';
  }

  const remainingSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
  return `${remainingSeconds}s remaining`;
}

export function QrPayloadView({ payload, alt, expiresAt }: QrPayloadViewProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) {
      return;
    }

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [expiresAt]);

  const isExpired = useMemo(() => {
    if (!expiresAt) {
      return false;
    }

    const timestamp = Date.parse(expiresAt);
    return Number.isNaN(timestamp) ? false : timestamp <= now;
  }, [expiresAt, now]);

  useEffect(() => {
    let cancelled = false;

    setDataUrl(null);
    setErrorMessage(null);

    if (isExpired) {
      return () => {
        cancelled = true;
      };
    }

    void QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
    })
      .then((nextDataUrl) => {
        if (cancelled) {
          return;
        }

        setDataUrl(nextDataUrl);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'QR rendering failed.',
        );
      });

    return () => {
      cancelled = true;
    };
  }, [isExpired, payload]);

  return (
    <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
      {expiresAt ? (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 12,
            border: isExpired
              ? '1px solid rgba(248, 113, 113, 0.3)'
              : '1px solid var(--elite-line)',
            background: isExpired
              ? 'rgba(185, 28, 28, 0.12)'
              : 'var(--elite-card)',
            color: isExpired ? 'var(--elite-danger)' : 'var(--elite-ink-soft)',
            fontWeight: 600,
          }}
        >
          QR status: {formatExpiry(expiresAt)}
        </div>
      ) : null}

      <div
        style={{
          width: 'fit-content',
          padding: 16,
          borderRadius: 18,
          background: 'var(--elite-card-strong)',
          border: '1px solid var(--elite-line)',
          boxShadow: 'var(--elite-shadow-sm)',
        }}
      >
        {isExpired ? (
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 320,
              maxWidth: '100%',
              aspectRatio: '1 / 1',
              borderRadius: 12,
              background: 'rgba(185, 28, 28, 0.12)',
              color: 'var(--elite-danger)',
              textAlign: 'center',
              padding: 16,
              fontWeight: 600,
            }}
          >
            This QR code expired. Restart the instance to generate a fresh code.
          </div>
        ) : dataUrl ? (
          <img
            src={dataUrl}
            alt={alt}
            style={{
              display: 'block',
              width: 320,
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 12,
            }}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 320,
              maxWidth: '100%',
              aspectRatio: '1 / 1',
              borderRadius: 12,
              background: 'var(--elite-paper)',
              color: 'var(--elite-muted)',
              textAlign: 'center',
              padding: 16,
            }}
          >
            {errorMessage
              ? `QR render failed: ${errorMessage}`
              : 'Generating QR image...'}
          </div>
        )}
      </div>

      <details>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
          Show raw QR payload
        </summary>
        <pre
          style={{
            marginBottom: 0,
            marginTop: 12,
            padding: 16,
            borderRadius: 14,
            background: 'rgba(2, 6, 23, 0.92)',
            color: '#f8fafc',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {payload}
        </pre>
      </details>
    </div>
  );
}
