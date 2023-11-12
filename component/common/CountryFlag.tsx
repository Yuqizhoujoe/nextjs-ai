export default function CountryFlag({ countryCode }: { countryCode: string }) {
  return (
    <img
      loading="lazy"
      width="20"
      srcSet={`https://flagcdn.com/w40/${countryCode}.png 2x`}
      src={`https://flagcdn.com/w20/${countryCode}.png`}
      alt={`${countryCode} Country Flag`}
    />
  );
}
