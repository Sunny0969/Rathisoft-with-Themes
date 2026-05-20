import { useCallback, useEffect, useState } from 'react';
import {
  fetchTeraboxPoster,
  getTeraboxPlaybackSrc,
} from '../utils/teraboxStream';

type TeraboxLecturePlayerProps = {
  shareUrl: string;
  title: string;
  fallbackUrl: string | null;
};

export function TeraboxLecturePlayer({
  shareUrl,
  title,
  fallbackUrl,
}: TeraboxLecturePlayerProps) {
  const [playbackSrc, setPlaybackSrc] = useState(() =>
    getTeraboxPlaybackSrc(shareUrl),
  );
  const [poster, setPoster] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPlaybackSrc(getTeraboxPlaybackSrc(shareUrl));
    setPoster(undefined);

    fetchTeraboxPoster(shareUrl)
      .then((meta) => {
        if (!cancelled && meta.poster) setPoster(meta.poster);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shareUrl, retryCount]);

  const handleVideoError = useCallback(() => {
    setError(
      'Video yahan play nahi ho rahi. Neeche TeraBox par dekhein, ya lecture Google Drive par upload karein.',
    );
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setRetryCount((n) => n + 1);
  }, []);

  if (loading) {
    return (
      <div className="lms-player-placeholder" aria-busy="true">
        <span className="lms-player-placeholder-icon" aria-hidden>
          ▶
        </span>
        <span>Loading lecture…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lms-player-placeholder lms-player-placeholder--external">
        <span className="lms-player-placeholder-icon" aria-hidden>
          ▶
        </span>
        <span style={{ maxWidth: '28rem', textAlign: 'center', lineHeight: 1.5 }}>
          {error}
        </span>
        <div
          className="lms-mt-4"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            className="lms-btn lms-btn--outline"
            onClick={handleRetry}
          >
            Retry
          </button>
          {fallbackUrl ? (
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lms-btn lms-btn--primary"
            >
              Play on TeraBox →
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <>
      <video
        key={playbackSrc}
        className="lms-native-video"
        src={playbackSrc}
        poster={poster}
        controls
        controlsList="nodownload"
        playsInline
        preload="auto"
        title={title}
        onError={handleVideoError}
      />
      {fallbackUrl ? (
        <p className="lms-player-external-fallback">
          <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">
            Backup: open on TeraBox →
          </a>
        </p>
      ) : null}
    </>
  );
}


