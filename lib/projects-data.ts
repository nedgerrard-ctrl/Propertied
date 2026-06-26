
export type Project = {
  id: string;
  name: string;
  suburb: string;
  state: string;
  type: "Apartment" | "Townhouse" | "House";
  propertyInterest: "off-plan" | "established";
  status: "Current" | "Upcoming";
  bedrooms: string;
  bathrooms: string;
  carSpaces: string;
  priceFrom: string;
  description: string;
  highlights: string[];
  image: string;
};

export const projects: Project[] = [
  {
    id: "hawthorn-park",
    name: "Hawthorn Park",
    suburb: "Hawthorn East",
    state: "VIC",
    type: "Apartment",
    propertyInterest: "off-plan",
    status: "Current",
    bedrooms: "1–3",
    bathrooms: "1–2",
    carSpaces: "1",
    priceFrom: "Sold Out",
    description:
      "Hawthorn Park is one of Melbourne's most celebrated residential developments, featuring 2000m² of landscaped parkland and Melbourne's first Skypool. Designed by award-winning Rothelowman Architects at 33–57 Camberwell Road, Hawthorn East, the development comprises apartments and townhouses across four distinctive buildings, each with its own unique lobby. Residents enjoy a world-class wellness centre, gym, yoga studio, massage rooms, rooftop alfresco dining and a private market garden.",
    highlights: [
      "Melbourne's first Skypool with views to the CBD",
      "2000m² of landscaped residential parkland",
      "Award-winning Rothelowman architecture",
      "Rooftop wellness centre, gym and yoga studio",
      "Miele/Gaggenau appliances and premium interiors",
      "PCA National Award — Development Innovation Finalist",
    ],
    image: "/images/house1.png",
  },
  {
    id: "yarra-1",
    name: "Yarra 1",
    suburb: "South Yarra",
    state: "VIC",
    type: "Apartment",
    propertyInterest: "off-plan",
    status: "Current",
    bedrooms: "1–3",
    bathrooms: "1–2",
    carSpaces: "1",
    priceFrom: "Sold Out",
    description:
      "Yarra One at 18 Claremont Street, South Yarra is Melbourne's most refined apartment address, designed by the visionary Fender Katsalidis Architects. Presenting the final masterstroke of the elite Forrest Hill pocket of South Yarra, the development offers breathtaking panoramic views, a soaring atrium and richly textured residences. Now fully completed and sold out, Yarra One set a new benchmark for luxury apartment living in Melbourne's inner-east.",
    highlights: [
      "Fender Katsalidis architecture — South Yarra's landmark address",
      "24/7 lifestyle butler and concierge service",
      "Rooftop sky terrace with BBQ and outdoor spa",
      "Private wine cellar, sauna and steam room",
      "In-house pet wash and residents' Tesla car share",
      "Library lounge and private dining area",
    ],
    image: "/images/house2.png",
  },
  {
    id: "the-barkly",
    name: "The Barkly",
    suburb: "St Kilda",
    state: "VIC",
    type: "Townhouse",
    propertyInterest: "off-plan",
    status: "Current",
    bedrooms: "2–4",
    bathrooms: "2–3",
    carSpaces: "1–2",
    priceFrom: "Sold Out",
    description:
      "The Barkly is a boutique collection of 65 architecturally designed townhouses by award-winning Rothelowman Architects. The development incorporates internal streetscapes, rain gardens and imaginative landscaping, maintaining the spirit of the traditional mews typology while delivering contemporary urban living. Six distinct house typologies feature integrated facades, solar shading devices and private outdoor spaces with deep light penetration throughout.",
    highlights: [
      "65 boutique townhouses by Rothelowman Architects",
      "Private courtyards and outdoor spaces on every residence",
      "Internal streetscapes with rain gardens and street trees",
      "Six distinct house typologies",
      "Integrated sustainable design and solar shading",
      "Strong community character — contemporary urban mews",
    ],
    image: "/images/house3.png",
  },
  {
    id: "elk",
    name: "Elk",
    suburb: "Elsternwick",
    state: "VIC",
    type: "Apartment",
    propertyInterest: "off-plan",
    status: "Current",
    bedrooms: "1–3",
    bathrooms: "1–2",
    carSpaces: "1",
    priceFrom: "Sold Out",
    description:
      "Elk is a fresh residential presence at Nepean Highway, Elsternwick, channelling casual Bayside charm with a natural material palette and modern design. Handcrafted by renowned architects Hayball, Elk capitalises on its privileged location bordering Elsternwick and Elwood — with close proximity to Port Phillip Bay and parkland. The rooftop garden enhances spectacular views over beach and city. Elk's signature Sky Homes offer split-level luxury at new heights above the Bayside skyline.",
    highlights: [
      "Hayball architecture — Elsternwick's Bayside landmark",
      "Rooftop garden with views over park, beach and city",
      "Signature Sky Homes with split-level living",
      "Borders Elsternwick and Elwood",
      "Natural material palette with contemporary detailing",
      "Walking distance to Port Phillip Bay",
    ],
    image: "/images/house4.png",
  },
  {
    id: "botanica",
    name: "Botanica",
    suburb: "Bundoora",
    state: "VIC",
    type: "Apartment",
    propertyInterest: "off-plan",
    status: "Current",
    bedrooms: "1–2",
    bathrooms: "1–2",
    carSpaces: "1",
    priceFrom: "Sold Out",
    description:
      "Botanic at Parc Vue in Bundoora is one of Melbourne's most unique residential opportunities — the only absolute park-fronting site in the area, where views and lifestyle are protected forever. Located just 14km north of the CBD, the development borders the expansive Bundoora Park with ground-level apartments offering direct private gate access into the park. Proximity to RMIT and La Trobe Universities and Northland Shopping Centre drove strong demand from both owner-occupiers and investors.",
    highlights: [
      "Only absolute park-fronting site in Bundoora",
      "Private gate access to Bundoora Park from ground level",
      "14km north of Melbourne CBD",
      "Adjacent to RMIT and La Trobe Universities",
      "Unobstructed park and city views protected forever",
      "One of Melbourne's top five suburbs for apartment capital growth",
    ],
    image: "/images/house1.png",
  },
];
