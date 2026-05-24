export const ourPeopleDefaults = {
  heroHeadingMain: "The people",
  heroHeadingAccent: "behind PPM.",
  heroSubtext:
    "Meet the team of experienced professionals working every day at the market coalface — bringing expertise across property sales, investment strategy, client operations, and asset management.",

  // Person 1
  person1Name: "Joan Alcock",
  person1Title: "Officer in Effective Control · Director",
  person1Bio1:
    "After a career in finance, Joan has spent the last thirteen years at the operational centre of Melbourne's new property market — leading sales campaigns for boutique developments and major projects alike. Her personal sales record runs to hundreds of millions of dollars. She has won local and international industry elite performance awards and was selected as the public face for two of Melbourne's most significant residential landmarks in televised campaigns.",
  person1Bio2:
    "She works daily at the market coalface — with industry stakeholders and buyers alike. Her real-time market intelligence is a primary asset of the PPM client relationship.",

  // Person 2
  person2Name: "Ned Gerrard",
  person2Title: "Director",
  person2Bio1:
    "An MBA graduate of Monash University with a career spanning senior executive roles in listed public companies and specialist management consulting engagements. Major developers retained Ned not as an external adviser but as an embedded marketing director — responsible for building entire project brands and implementing sales frameworks that delivered hundreds of millions in settlements.",
  person2Bio2:
    "At PPM, Ned applies his consulting discipline to the supply side of every investment opportunity — assessing developer feasibility, pricing strategy, construction risk, and long-term capital positioning, while at the same time being able to use his marketing skill and experience to achieve sales in his own right.",
  person2Bio3:
    "The combination of Joan's operational market intelligence and Ned's analytical framework gives PPM clients a measurable informational advantage — the ability to identify value ahead of the market and avoid risk before it becomes visible.",

  // Person 3
  person3Name: "Christopher Kraus",
  person3Title: "Client Operations Manager",
  person3Bio1:
    "Another Monash University business graduate, Chris brings to PPM a rare blend of analytical discipline and frontline client-service experience. Having worked predominantly in the taxation and energy sectors, he has developed a deep capability in resolving complex customer enquiries, interpreting regulatory frameworks and managing high volume information flows with precision, while maintaining accuracy under pressure.",
  person3Bio2:
    "Chris brings a service-driven mindset to PPM, exceptional communication skills and a strong compliance orientation — all essential to PPM's premium off-the-plan and property stewardship operations.",

  // Person 4
  person4Name: "George Tapia",
  person4Title: "Head of Maintenance",
  person4Bio1:
    "In a long distinguished career of military service, George developed leadership, problem-solving and personal management skills that now underpin his role as PPM's Head of Maintenance. Having established and operated his own successful business servicing Melbourne's residential inner-city properties, George has built a reputation for reliability, punctuality and high-quality workmanship.",
  person4Bio2:
    "His hands-on approach and team management ensure PPM's rental providers can have the peace of mind that their asset equity is well preserved. George is well known for his attention to detail, reflected in his meticulous reports. He oversees all maintenance operations for PPM's strictly capped $100 million portfolio.",
};

export type OurPeopleContentData = typeof ourPeopleDefaults;

export function mergeOurPeopleContent(doc: Record<string, unknown> | null): OurPeopleContentData {
  if (!doc) return ourPeopleDefaults;
  const knownKeys = new Set(Object.keys(ourPeopleDefaults));
  const clean = Object.fromEntries(
    Object.entries(doc).filter(([k, v]) => knownKeys.has(k) && v !== "" && v !== null && v !== undefined)
  );
  return { ...ourPeopleDefaults, ...clean } as OurPeopleContentData;
}
