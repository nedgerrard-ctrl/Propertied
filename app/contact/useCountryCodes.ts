"use client";

import { useEffect, useState } from "react";

export type CountryOption = {
  name: string;
  code: string;
  dialCode: string;
  label: string;
};

const FALLBACK_COUNTRIES: CountryOption[] = [
  { name: "Australia", code: "AU", dialCode: "+61", label: "Australia (+61)" },
  { name: "Singapore", code: "SG", dialCode: "+65", label: "Singapore (+65)" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", label: "United Kingdom (+44)" },
  { name: "United States", code: "US", dialCode: "+1", label: "United States (+1)" },
  { name: "China", code: "CN", dialCode: "+86", label: "China (+86)" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", label: "New Zealand (+64)" },
];

export function useCountryCodes(defaultDialCode = "+61") {
  const [countries, setCountries] = useState<CountryOption[]>(FALLBACK_COUNTRIES);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadCountries() {
      try {
        const response = await fetch("/api/countries");
        const data = await response.json();

        if (!response.ok || !data.success || !Array.isArray(data.countries)) {
          return;
        }

        if (!ignore) {
          setCountries(data.countries);
        }
      } catch {
        // fallback list remains in place
      } finally {
        if (!ignore) {
          setLoadingCountries(false);
        }
      }
    }

    loadCountries();

    return () => {
      ignore = true;
    };
  }, []);

  const hasDefault = countries.some((country) => country.dialCode === defaultDialCode);

  return {
    countries,
    loadingCountries,
    defaultDialCode: hasDefault ? defaultDialCode : countries[0]?.dialCode ?? "+61",
  };
}