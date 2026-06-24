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
    "Meet the team of experienced professionals working every day at the market coalface — bringing expertise across property sales, investment strategy, client operations, and asset management.",

  people: [
    {
      id: "person-1",
      name: "Joan Alcock",
      title: "Officer in Effective Control · Director",
      description:
        "After a career in finance, Joan has spent the last thirteen years at the operational centre of Melbourne's new property market — leading sales campaigns for boutique developments and major projects alike. Her personal sales record runs to hundreds of millions of dollars. She has won local and international industry elite performance awards and was selected as the public face for two of Melbourne's most significant residential landmarks in televised campaigns.\n\nShe works daily at the market coalface — with industry stakeholders and buyers alike. Her real-time market intelligence is a primary asset of the PPM client relationship.",
    },
    {
      id: "person-2",
      name: "Ned Gerrard",
      title: "Director",
      description:
        "An MBA graduate of Monash University with a career spanning senior executive roles in listed public companies and specialist management consulting engagements. Multinational developers retained Ned not as an external adviser but as an embedded marketing director — responsible for building entire project brands and implementing sales frameworks that delivered hundreds of millions in settlements.\n\nAt PPM, Ned applies his consulting discipline to the supply side of every investment opportunity — assessing developer feasibility, pricing strategy, construction risk, and long-term capital positioning, while at the same time being able to use his marketing skill and experience to achieve sales in his own right.\n\nNed brings deep insider industry knowledge and a highly sophisticated approach to the off-the-plan market.",
    },
    {
      id: "person-james",
      name: "James Gerrard",
      title: "Digital Operations Manager",
      description:
        "After studying law, James joined one of the world's largest gaming companies (15 million+ subscribers) as Creative Director. In this role he was responsible for producing, editing and promoting content across online video and social media platforms.\n\nHaving spent time in Amsterdam during the height of the Covid pandemic, James returned to Australia with deep expertise in digital interfaces and content strategy. His skills ensure PPM maintains technological efficiency and delivers a strong digital sales advantage.",
    },
    {
      id: "person-3",
      name: "Christopher Kraus",
      title: "Client Operations Manager",
      description:
        "Another Monash University business graduate, Chris brings to PPM a rare blend of analytical discipline and frontline client-service experience. Having worked predominantly in the taxation and energy sectors, he has developed a deep capability in resolving complex customer enquiries, interpreting regulatory frameworks and managing high volume information flows with precision, while maintaining accuracy under pressure.\n\nChris brings a service-driven mindset to PPM, exceptional communication skills and a strong compliance orientation — all essential to PPM's premium off-the-plan and property stewardship operations.",
    },
    {
      id: "person-4",
      name: "George Tapia",
      title: "Head of Maintenance",
      description:
        "In a long distinguished career of military service, George developed leadership, problem-solving and personal management skills that now underpin his role as PPM's Head of Maintenance. Having established and operated his own successful business servicing Melbourne's residential inner-city properties, George has built a reputation for reliability, punctuality and high-quality workmanship.\n\nHis hands-on approach and team management ensure PPM's rental providers can have the peace of mind that their asset equity is well preserved. George is well known for his attention to detail, reflected in his meticulous reports. He oversees all maintenance operations for PPM's strictly capped $100 million portfolio.",
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
