export type CountryCodeOption = {
  code: string;
  label: string;
  country: string;
  cca2: string;
};

type RestCountry = {
  name?: {
    common?: string;
  };
  cca2?: string;
  idd?: {
    root?: string;
    suffixes?: string[];
  };
};

const FALLBACK_COUNTRY_CODES: CountryCodeOption[] = [
  { country: "Australia", cca2: "AU", code: "+61", label: "Australia (+61)" },
  { country: "Singapore", cca2: "SG", code: "+65", label: "Singapore (+65)" },
  { country: "United Kingdom", cca2: "GB", code: "+44", label: "United Kingdom (+44)" },
  { country: "United States", cca2: "US", code: "+1", label: "United States (+1)" },
  { country: "China", cca2: "CN", code: "+86", label: "China (+86)" },
  { country: "New Zealand", cca2: "NZ", code: "+64", label: "New Zealand (+64)" },
];

function toDialCode(country: RestCountry): string | null {
  const root = country.idd?.root?.trim();
  const suffix = country.idd?.suffixes?.[0]?.trim();

  if (!root || !suffix) return null;
  return `${root}${suffix}`;
}

export async function getCountryCodeOptions(): Promise<CountryCodeOption[]> {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,idd",
      {
        next: { revalidate: 604800 }, // 7 days
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch country codes");
    }

    const countries = (await response.json()) as RestCountry[];

    const options = countries
      .map((country) => {
        const dialCode = toDialCode(country);
        const countryName = country.name?.common?.trim();
        const cca2 = country.cca2?.trim();

        if (!dialCode || !countryName || !cca2) return null;

        return {
          country: countryName,
          cca2,
          code: dialCode,
          label: `${countryName} (${dialCode})`,
        };
      })
      .filter((item): item is CountryCodeOption => Boolean(item))
      .sort((a, b) => a.country.localeCompare(b.country));

    if (options.length === 0) {
      return FALLBACK_COUNTRY_CODES;
    }

    return options;
  } catch {
    return FALLBACK_COUNTRY_CODES;
  }
}