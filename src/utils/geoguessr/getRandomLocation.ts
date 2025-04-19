import { Entry, EntryType } from "../../types/geoguessrTypes";
import { extractEntries } from "./extractEntries";

const categorised = extractEntries();
let previousGuesses: Entry[] = [];

export const getRandomLocation = (types: EntryType[]): Entry => {
  const pool = types.flatMap((type) => categorised[type as EntryType]);

  const historyLimit = Math.floor(pool.length * 0.5); // 50%
  const recent = previousGuesses.slice(-historyLimit).map((entry) => entry.name);
  const filtered = pool.filter((entry) => !recent.includes(entry.name));

  const choices = filtered.length > 0 ? filtered : pool;
  const random = choices[Math.floor(Math.random() * choices.length)];

  previousGuesses.push(random);
  if (previousGuesses.length > historyLimit) {
    previousGuesses = previousGuesses.slice(-historyLimit);
  }

  return random;
};
