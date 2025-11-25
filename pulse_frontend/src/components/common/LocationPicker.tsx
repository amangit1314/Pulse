"use client";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Input } from "@/components/ui/input";

export function LocationPicker({ onSelect }: { onSelect: (loc: string) => void }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  return (
    <div className="relative">
      <Input
        value={value}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search location..."
        className="rounded-xl"
      />
      {status === "OK" && (
        <ul className="absolute bg-white border rounded-xl mt-1 w-full z-10 shadow">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              className="px-3 py-2 hover:bg-zinc-100 cursor-pointer"
              onClick={async () => {
                setValue(description, false);
                clearSuggestions();
                onSelect(description);
                // Optionally get coordinates
                const results = await getGeocode({ address: description });
                const { lat, lng } = await getLatLng(results[0]);
                console.log("Selected coords:", lat, lng);
              }}
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
