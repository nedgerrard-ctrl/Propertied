export type PastProject = {
  id:       string
  name:     string
  address:  string
  imageUrl: string
  link:     string
}

export type PastProjectsContentData = {
  heroHeadingMain:   string
  heroHeadingAccent: string
  heroSubtext:       string
  closingText:       string
  projects:          PastProject[]
}

export const pastProjectsDefaults: PastProjectsContentData = {
  heroHeadingMain:   "Past",
  heroHeadingAccent: "Projects.",
  heroSubtext:
    "A selection of Melbourne developments PPM has been involved with during the off-the-plan era. Click any project to visit the development site.",
  closingText:
    "In its primary ongoing B2C model — PPM sources property directly against each client's wish list. Rather than presenting a static catalogue, we begin every engagement with a structured brief: location, configuration, price range, yield target or lifestyle criteria. From there, we identify and present only the developments and resale opportunities that genuinely match. Clients do not browse — they submit a brief, and we do the work.",

  projects: [
    {
      id:       "hawthorn-park",
      name:     "Hawthorn Park",
      address:  "Hawthorn, Melbourne VIC",
      imageUrl: "https://placehold.co/800x500/1c1814/c8a96e?text=Hawthorn+Park",
      link:     "https://www.hawthorn-park.com.au/",
    },
    {
      id:       "yarra-1",
      name:     "Yarra 1",
      address:  "Richmond, Melbourne VIC",
      imageUrl: "https://placehold.co/800x500/1c1814/c8a96e?text=Yarra+1",
      link:     "https://www.yarraone.com.au/",
    },
    {
      id:       "the-barkly",
      name:     "The Barkly",
      address:  "St Kilda, Melbourne VIC",
      imageUrl: "https://placehold.co/800x500/1c1814/c8a96e?text=The+Barkly",
      link:     "https://thebarkly.com.au/",
    },
    {
      id:       "elk",
      name:     "Elk",
      address:  "Richmond, Melbourne VIC",
      imageUrl: "https://placehold.co/800x500/1c1814/c8a96e?text=Elk",
      link:     "https://www.vpp.net.au/elk",
    },
    {
      id:       "botanica",
      name:     "Botanica",
      address:  "Melbourne VIC",
      imageUrl: "https://placehold.co/800x500/1c1814/c8a96e?text=Botanica",
      link:     "https://a-d.com.au/buying-living/market-insights/botanic-parc-vue",
    },
  ],
}

export function mergePastProjectsContent(
  doc: Record<string, unknown> | null
): PastProjectsContentData {
  if (!doc) return pastProjectsDefaults
  return {
    heroHeadingMain:
      (doc.heroHeadingMain as string) || pastProjectsDefaults.heroHeadingMain,
    heroHeadingAccent:
      (doc.heroHeadingAccent as string) || pastProjectsDefaults.heroHeadingAccent,
    heroSubtext:
      (doc.heroSubtext as string) || pastProjectsDefaults.heroSubtext,
    closingText:
      (doc.closingText as string) || pastProjectsDefaults.closingText,
    projects: pastProjectsDefaults.projects,
  }
}
