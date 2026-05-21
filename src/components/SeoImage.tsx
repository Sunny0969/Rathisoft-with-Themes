import type { ImgHTMLAttributes } from 'react'
import { toWebpSrc } from '../utils/imageAssets'

export type SeoImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'width' | 'height'
> & {
  alt: string
  width: number
  height: number
  title?: string
  /** When true (default), local .png/.jpg paths use sibling .webp from build script */
  preferWebp?: boolean
}

export function SeoImage({
  src,
  alt,
  width,
  height,
  title,
  preferWebp = true,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}: SeoImageProps) {
  const resolved =
    preferWebp && typeof src === 'string' ? toWebpSrc(src) : src

  return (
    <img
      src={resolved}
      alt={alt}
      title={title ?? alt}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  )
}
