import { getRelatedServiceLinks } from '../data/internalLinks'
import { InternalLinksNav } from './InternalLinksNav'

type RelatedServicesLinksProps = {
  slug: string
}

export function RelatedServicesLinks({ slug }: RelatedServicesLinksProps) {
  const links = getRelatedServiceLinks(slug)
  return (
    <InternalLinksNav
      links={links}
      heading="Related services"
      ariaLabel="Related service pages"
      className="internal-links--related-services"
    />
  )
}
