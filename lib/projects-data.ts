
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
    id: "harbour-edge-docklands",
    name: "Harbour Edge",
    suburb: "Docklands",
    state: "VIC",
    type: "Apartment",
    propertyInterest: "off-plan",
    status: "Current",
    bedrooms: "1–3",
    bathrooms: "1–2",
    carSpaces: "0–1",
    priceFrom: "From $480,000",
    description:
      "Harbour Edge is a landmark residential development positioned directly on Melbourne's waterfront precinct in Docklands. Designed by a multi-award-winning architectural practice, each residence captures sweeping views of Port Phillip Bay and the CBD skyline. Interiors feature floor-to-ceiling glazing, high-specification European appliances, and generous balconies that blur the boundary between inside and out. The building offers premium shared amenities including a rooftop terrace, co-working lounge, and secure basement parking. Docklands' ongoing infrastructure investment — including improved pedestrian links to the CBD and expanded retail amenity — makes this location increasingly compelling for both owner-occupiers and investors.",
    highlights: [
      "Waterfront location in Melbourne's Docklands precinct",
      "Award-winning architectural design",
      "Rooftop terrace with panoramic bay and city views",
      "European appliances throughout",
      "Concierge service and secure basement parking",
      "EV charging infrastructure",
    ],
    image: "/images/house1.png",
  },
  {
    id: "elm-grove-box-hill",
    name: "Elm Grove",
    suburb: "Box Hill",
    state: "VIC",
    type: "Apartment",
    propertyInterest: "off-plan",
    status: "Current",
    bedrooms: "1–2",
    bathrooms: "1–2",
    carSpaces: "0–1",
    priceFrom: "From $395,000",
    description:
      "Elm Grove brings a considered residential offering to Box Hill — one of Melbourne's fastest-growing activity centres, with direct access to the Ringwood rail corridor and a thriving dining and retail precinct. The development comprises one and two-bedroom apartments with flexible open-plan living, stone kitchen benchtops, and private balconies oriented to maximise natural light. Box Hill's strong healthcare, education, and employment base drives consistent rental demand, making Elm Grove a compelling investment option for both local and overseas buyers. The suburb's population growth and infrastructure pipeline are well above Melbourne's metropolitan average.",
    highlights: [
      "Prime Box Hill location — major activity centre on the Ringwood line",
      "Open-plan layouts with north-facing orientation",
      "Stone benchtops and integrated appliances",
      "Walking distance to Box Hill Central and hospital precinct",
      "Strong rental yield history in the suburb",
      "Builder warranty on all fittings and fixtures",
    ],
    image: "/images/house2.png",
  },
  {
    id: "parkview-residences-richmond",
    name: "Parkview Residences",
    suburb: "Richmond",
    state: "VIC",
    type: "Townhouse",
    propertyInterest: "off-plan",
    status: "Current",
    bedrooms: "3–4",
    bathrooms: "2–3",
    carSpaces: "2",
    priceFrom: "From $1,150,000",
    description:
      "Parkview Residences offers a boutique collection of architecturally designed townhouses in inner-east Richmond, positioned within easy walking distance of the Yarra River trail, Bridge Road retail strip, and Richmond train station. Each three and four-bedroom residence features a private courtyard or rooftop terrace, double lock-up garage, and interiors finished to an uncompromising standard — including Vintec wine storage, Miele appliances, and custom joinery throughout. The development suits owner-occupiers seeking the lifestyle of inner Melbourne with the practicality and space of a townhouse, as well as investors targeting the premium rental market.",
    highlights: [
      "Boutique collection — only 12 residences",
      "3 and 4 bedroom layouts with private outdoor space",
      "Double lock-up garage on each residence",
      "Miele appliance suite and Vintec wine storage",
      "Walking distance to the Yarra River trail and CBD",
      "Premium rental market — strong capital growth history",
    ],
    image: "/images/house3.png",
  },
  {
    id: "verdant-glen-waverley",
    name: "Verdant",
    suburb: "Glen Waverley",
    state: "VIC",
    type: "Apartment",
    propertyInterest: "off-plan",
    status: "Upcoming",
    bedrooms: "1–3",
    bathrooms: "1–2",
    carSpaces: "0–2",
    priceFrom: "From $420,000",
    description:
      "Verdant is an upcoming residential development in Glen Waverley's established town centre — one of Melbourne's most in-demand suburban hubs. The project will deliver a curated collection of one, two, and three-bedroom residences across a mid-rise building, with ground-floor retail activation and landscaped communal gardens. Glen Waverley offers direct access to the Glen Waverley train line, The Glen Shopping Centre, and a nationally ranked school zone that consistently attracts family buyers. Register your interest now to receive first access to floor plans, pricing, and priority selection before the project opens to the public.",
    highlights: [
      "Registrations of interest now open — priority access available",
      "Glen Waverley town centre location — direct train access to CBD",
      "Nationally ranked school zone",
      "Landscaped communal gardens and ground-floor retail",
      "1, 2, and 3 bedroom configurations available",
      "Designed for both owner-occupiers and investors",
    ],
    image: "/images/house4.png",
  },
];