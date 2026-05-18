const TERABOX_HOST_PATTERN =
  /(?:^|\.)((?:1024)?terabox(?:app)?\.com|1024tera\.com)$/i;

function isTeraboxHost(hostname: string): boolean {
  return TERABOX_HOST_PATTERN.test(hostname);
}

/**
 * Share links use `/s/1{surl}`; redirects use `?surl={surl}` without the leading `1`.
 */
function normalizeTeraboxSurl(code: string): string {
  if (code.startsWith('1') && code.length > 1) {
    return code.slice(1);
  }
  return code;
}

/** Extract canonical TeraBox `surl` from a share or embed URL. */
export function parseTeraboxSurl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (!isTeraboxHost(url.hostname)) return null;

    const fromQuery = url.searchParams.get('surl');
    if (fromQuery) return normalizeTeraboxSurl(fromQuery);

    const pathMatch = url.pathname.match(/\/s\/([^/?#]+)/i);
    if (pathMatch?.[1]) return normalizeTeraboxSurl(pathMatch[1]);
  } catch {
    return null;
  }

  return null;
}

export function getTeraboxEmbedUrl(surl: string): string {
  return `https://www.terabox.com/sharing/embed?surl=${encodeURIComponent(surl)}`;
}

export function getTeraboxWatchUrl(surl: string): string {
  return `https://www.terabox.app/sharing/link?surl=${encodeURIComponent(surl)}`;
}

/** Google Drive file ID, TeraBox share URL, or other http(s) URL. */
export function getLectureVideoSrc(driveFileId: string): string {
  const trimmed = driveFileId.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://drive.google.com/file/d/${trimmed}/preview`;
  }

  const surl = parseTeraboxSurl(trimmed);
  if (surl) return getTeraboxEmbedUrl(surl);

  return trimmed;
}

export function isTeraboxLecture(driveFileId: string): boolean {
  return parseTeraboxSurl(driveFileId.trim()) !== null;
}

/** Non–Google Drive http(s) links that are not TeraBox (cannot be embedded reliably). */
export function isExternalLectureUrl(driveFileId: string): boolean {
  const trimmed = driveFileId.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  return !isTeraboxLecture(trimmed);
}

export function getLectureFallbackUrl(driveFileId: string): string | null {
  const surl = parseTeraboxSurl(driveFileId.trim());
  if (surl) return getTeraboxWatchUrl(surl);

  const trimmed = driveFileId.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  return null;
}
