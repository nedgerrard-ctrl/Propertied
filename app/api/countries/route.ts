import { NextResponse } from "next/server";

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

type CountryOption = {
  name: string;
  code: string;
  dialCode: string;
  label: string;
};

function buildDialCode(country: RestCountry) {
  const root = country.idd?.root ?? "";
  const suffix = country.idd?.suffixes?.[0] ?? "";

  if (!root) return "";
  return `${root}${suffix}`;
}

export async function GET() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,idd",
      {
        next: { revalidate: 60 * 60 * 24 }, // 24 hours
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch countries." },
        { status: 502 }
      );
    }

    const countries = (await response.json()) as RestCountry[];

    const options: CountryOption[] = countries
      .map((country) => {
        const name = country.name?.common?.trim() ?? "";
        const code = country.cca2?.trim() ?? "";
        const dialCode = buildDialCode(country);

        if (!name || !code || !dialCode) return null;

        return {
          name,
          code,
          dialCode,
          label: `${name} (${dialCode})`,
        };
      })
      .filter((item): item is CountryOption => Boolean(item))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      countries: options,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong while loading countries." },
      { status: 500 }
    );
  }
}