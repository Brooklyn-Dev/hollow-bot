import { Charm } from "../types/charmsTypes";

export function getRandomCharmLoadout(
  charms: Charm[],
  maxNotches: number,
  allowOvercharm: boolean
): { selected: Charm[]; totalNotches: number } {
  const shuffled = [...charms].sort(() => Math.random() - 0.5);
  const selected: Charm[] = [];
  let totalNotches = 0;

  for (const charm of shuffled) {
    const notches = Number(charm.notches) || 0;

    if (hasIncompatibleCharm(selected, charm.id)) continue;

    if (totalNotches + notches <= maxNotches) {
      selected.push(charm);
      totalNotches += notches;
    } else if (allowOvercharm && totalNotches < maxNotches) {
      selected.push(charm);
      totalNotches += notches;
      break;
    }
  }

  return { selected, totalNotches };
}

function hasIncompatibleCharm(selected: Charm[], charmId: string): boolean {
  // Grimmchild
  if (charmId === "42") {
    return selected.some((charm) => charm.id === "43");
  }
  // Carefree Melody
  if (charmId === "43") {
    return selected.some((charm) => charm.id === "42");
  }
  return false;
}
