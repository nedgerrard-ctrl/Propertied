export type Person = {
  id: string;
  name: string;
  title: string;
  description: string; // paragraphs separated by \n\n
  image?: string;
};

export type OurPeopleContentData = {
  heroHeadingMain: string;
  heroHeadingAccent: string;
  heroSubtext: string;
  people: Person[];
};

export const ourPeopleDefaults: OurPeopleContentData = {
  heroHeadingMain: "The people",
  heroHeadingAccent: "behind PPM.",
  heroSubtext:
    "The team behind PPM — and the depth of experience each brings to your engagement.",

  people: [
    {
      id: "person-1",
      name: "Joan Alcock",
      title: "Officer in Effective Control · Director",
      description:
        "After a successful career in finance, Joan has worked at the operational coalface of Melbourne's new property market since 2013. She has led high profile sales campaigns for boutique developments and major projects, achieving personal sales in the hundreds of millions of dollars.\n\nJoan has won multiple industry performance awards and was chosen as the media face for two of Melbourne's most significant residential landmarks.\n\nShe brings sharp real-time market intelligence and the deep understanding of buyer needs to every PPM client relationship.",
    },
    {
      id: "person-2",
      name: "Ned Gerrard",
      title: "Director & Principal",
      description:
        "With multiple business qualifications from Monash University, including an MBA, Ned has had a distinguished career spanning senior executive roles in listed public companies. Major developers retained Ned not only as an external adviser, but also as an embedded marketing director tasked with building their corporate brand and developing and implementing project sales and marketing strategies.\n\nConsulting wise he has assisted developers with their organisational structuring, operational frameworks and project turnarounds. He brings intimate industry knowledge to an unsophisticated off-the-plan market.",
    },
    {
      id: "person-3",
      name: "Christopher Kraus",
      title: "Client Operations Manager",
      description:
        "A Monash University business graduate, Chris brings a rare blend of analytical discipline and frontline client-service experience. Having worked predominantly in the taxation and energy sectors, he excels at resolving complex enquiries, interpreting regulatory frameworks and managing high volume information flows with precision and accuracy under pressure.\n\nChris' service-driven mindset and strong compliance orientation are essential to PPM's premium asset management operations.",
    },
    {
      id: "person-james",
      name: "James Gerrard",
      title: "Digital Operations Manager",
      description:
        "After studying law, James joined one of the world's largest gaming companies (15 million+ subscribers) as Creative Director. In this role he was responsible for producing, editing and promoting content across online video and social media platforms.\n\nHaving spent time in Amsterdam during the height of the Covid pandemic, James returned to Australia with deep expertise in digital interfaces and content strategy. His skills ensure PPM maintains technological efficiency and delivers a strong digital sales advantage.",
    },
    {
      id: "person-4",
      name: "George Tapia",
      title: "Head of Maintenance",
      description:
        "With a long and distinguished military career, George developed exceptional leadership, problem-solving and operational management skills. He later established and ran his own successful business servicing Melbourne's inner-city residential properties. George is known for his meticulous attention to detail, reliability and high-quality workmanship.\n\nHe oversees all maintenance operations across PPM's strictly capped $100 million portfolio, ensuring asset equity is protected and rental providers have complete peace of mind.",
    },
  ],
};

export function mergeOurPeopleContent(
  doc: Record<string, unknown> | null
): OurPeopleContentData {
  if (!doc) return ourPeopleDefaults;

  const heroHeadingMain =
    typeof doc.heroHeadingMain === "string" && doc.heroHeadingMain
      ? doc.heroHeadingMain
      : ourPeopleDefaults.heroHeadingMain;
  const heroHeadingAccent =
    typeof doc.heroHeadingAccent === "string" && doc.heroHeadingAccent
      ? doc.heroHeadingAccent
      : ourPeopleDefaults.heroHeadingAccent;
  const heroSubtext =
    typeof doc.heroSubtext === "string" && doc.heroSubtext
      ? doc.heroSubtext
      : ourPeopleDefaults.heroSubtext;

  let people: Person[];

  if (Array.isArray(doc.people) && doc.people.length > 0) {
    // New format: people array stored directly
    people = doc.people as Person[];
  } else if (typeof doc.person1Name === "string" && doc.person1Name) {
    // Migrate from legacy flat fields (person1Name, person1Bio1, …)
    people = [];
    for (let i = 1; i <= 20; i++) {
      const name = doc[`person${i}Name`] as string | undefined;
      if (!name) break;
      const title = (doc[`person${i}Title`] as string) || "";
      const bios: string[] = [];
      for (let j = 1; j <= 10; j++) {
        const bio = doc[`person${i}Bio${j}`] as string | undefined;
        if (bio) bios.push(bio);
        else break;
      }
      people.push({ id: `person-${i}`, name, title, description: bios.join("\n\n") });
    }
    if (people.length === 0) people = ourPeopleDefaults.people;
  } else {
    people = ourPeopleDefaults.people;
  }

  return { heroHeadingMain, heroHeadingAccent, heroSubtext, people };
}
