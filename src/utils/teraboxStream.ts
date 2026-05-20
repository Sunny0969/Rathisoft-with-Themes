const TERABOX_RESOLVER_API =
  import.meta.env.VITE_TERABOX_RESOLVER_API?.trim() ||
  'https://tera-core.vercel.app/api';

export type TeraboxStreamResult = {
  streamUrl: string;
  filename?: string;
  poster?: string;
};

type TeraboxResolverFile = {
  download_link?: string;
  filename?: string;
  is_directory?: boolean;
  thumbnails?: Record<string, string>;
};

type TeraboxResolverResponse = {
  status?: string;
  error?: string;
  files?: TeraboxResolverFile[];
};

/** Same-origin proxy adds Referer / optional cookie server-side. */
export function getTeraboxPlaybackSrc(shareUrl: string): string {
  return `/api/terabox-media?share=${encodeURIComponent(shareUrl.trim())}`;
}

export async function fetchTeraboxPoster(
  shareUrl: string,
): Promise<Pick<TeraboxStreamResult, 'poster' | 'filename'>> {
  const endpoint = `${TERABOX_RESOLVER_API}?url=${encodeURIComponent(shareUrl.trim())}`;
  const res = await fetch(endpoint);

  if (!res.ok) {
    return {};
  }

  const data = (await res.json()) as TeraboxResolverResponse;
  const file = data.files?.[0];
  if (!file) return {};

  const poster =
    file.thumbnails?.['850x580'] ??
    file.thumbnails?.['360x270'] ??
    file.thumbnails?.['140x90'];

  return { poster, filename: file.filename };
}
