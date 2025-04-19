import { Interaction } from "discord.js";

import geoguessrModes from "../../data/geoguessrModes.json";
import charms from "../../data/charms.json";
import journal from "../../data/journal.json";

module.exports = (interaction: Interaction) => {
  if (!interaction.isAutocomplete()) return;

  const focusedValue = interaction.options.getFocused().toLowerCase();
  let results: { name: string; value: string }[] = [];

  switch (interaction.commandName) {
    case "charms":
      results = charms
        .filter((charm) => charm.name.toLowerCase().startsWith(focusedValue))
        .map((choice) => ({
          name: choice.name,
          value: choice.name,
        }));
      break;

    case "geoguessr":
      results = geoguessrModes
        .filter((mode) => mode.name.toLowerCase().startsWith(focusedValue))
        .map((mode) => ({ name: mode.name, value: mode.name }));
      break;

    case "journal":
      results = journal
        .filter((entry) => entry.name.toLowerCase().startsWith(focusedValue))
        .map((entry) => ({
          name: entry.name,
          value: entry.name,
        }));
      break;

    default:
      break;
  }

  // Limit responses
  interaction.respond(results.slice(0, 25)).catch(() => {});
};
