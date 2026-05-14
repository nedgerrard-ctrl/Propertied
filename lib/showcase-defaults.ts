import type { ShowcaseProjectData } from "@/app/LandingPage";

export const showcaseDefaults: ShowcaseProjectData[] = [
  {
    _id: "default-elk",
    name: "elk",
    address: "Apartments in Elsternwick, VIC 3185",
    image: "/images/house1.png",
    order: 0,
    published: true,
  },
  {
    _id: "default-yarra-one",
    name: "Yarra One",
    address: "18 Claremont St, South Yarra VIC 3141",
    image: "/images/house2.png",
    order: 1,
    published: true,
  },
  {
    _id: "default-hawthorn-park",
    name: "Hawthorn Park",
    address: "55 Camberwell Rd, Hawthorn East VIC 3123",
    image: "/images/house3.png",
    order: 2,
    published: true,
  },
  {
    _id: "default-noir",
    name: "noir",
    address: "8 Garden St, South Yarra VIC 3141",
    image: "/images/house4.png",
    order: 3,
    published: true,
  },
  {
    _id: "default-barkly",
    name: "Barkly Estate",
    address: "Brunswick, VIC",
    image: "/images/For buyers.jpg",
    order: 4,
    published: true,
  },
];

export function mergeShowcaseProjects(
  dbProjects: ShowcaseProjectData[]
): ShowcaseProjectData[] {
  if (dbProjects.length === 0) return showcaseDefaults;

  // For any DB project that has a blank image, fill in the matching default image
  return dbProjects.map((p) => {
    if (p.image) return p;
    const match = showcaseDefaults.find(
      (d) => d.name.toLowerCase() === p.name.toLowerCase()
    );
    return match ? { ...p, image: match.image } : p;
  });
}
