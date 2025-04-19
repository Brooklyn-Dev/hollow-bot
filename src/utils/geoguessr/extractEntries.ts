import { Area, Entry, EntryType, EntryTypes } from "../../types/geoguessrTypes";
import locationsJson from "../../data/locations.json";

const locations = locationsJson as Area[];

export const extractEntries = (): Record<EntryType, Entry[]> => {
  const categorised = Object.fromEntries(EntryTypes.map((type) => [type, [] as Entry[]])) as Record<
    EntryType,
    Entry[]
  >;

  for (const area of locations) {
    if (area.imageUrl) {
      categorised.area.push({
        id: area.id,
        name: area.name,
        imageUrl: area.imageUrl,
        type: "area",
      });
    }

    for (const type of EntryTypes) {
      const key = type as keyof Area;
      const entries = area[key] as Entry[] | undefined;

      for (const entry of entries ?? []) {
        if (entry.imageUrl) {
          categorised[type].push({
            id: entry.id,
            name: entry.name,
            imageUrl: entry.imageUrl,
            type,
          });
        }
      }
    }
  }

  return categorised;
};
