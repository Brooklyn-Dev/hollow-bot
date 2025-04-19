export type GeoguessrMode = {
  id: string;
  name: string;
  categories: EntryType[];
};

export type SubLocation = {
  id: string;
  name: string;
  imageUrl: string;
};

export type Area = {
  id: string;
  name: string;
  imageUrl: string;
  bosses?: SubLocation[];
  charms?: SubLocation[];
  landmarks?: SubLocation[];
  specialRooms?: SubLocation[];
  subareas?: SubLocation[];
};

export type Entry = {
  id: string;
  name: string;
  imageUrl: string;
  type: EntryType;
};

export const EntryTypes = ["area", "boss", "charm", "landmark", "specialRoom", "subarea"] as const;
export type EntryType = (typeof EntryTypes)[number];
