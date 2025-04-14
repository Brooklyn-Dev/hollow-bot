import { Interaction } from "discord.js";

import charms from "../../data/charms.json";
import journal from "../../data/journal.json";

module.exports = (interaction: Interaction) => {
  if (!interaction.isAutocomplete()) return;

  const focusedValue = interaction.options.getFocused();

  let filteredChoices;
  let results: { name: string; value: string }[] = [];

  switch (interaction.commandName) {
    case "charms":
      filteredChoices = charms.filter((charm) =>
        charm.name.toLowerCase().startsWith(focusedValue.toLowerCase())
      );
      results = filteredChoices.map((choice) => {
        return {
          name: choice.name,
          value: choice.name,
        };
      });
      break;

    case "journal":
      filteredChoices = journal.filter((entry) =>
        entry.name.toLowerCase().startsWith(focusedValue.toLowerCase())
      );
      results = filteredChoices.map((entry) => {
        return {
          name: entry.name,
          value: entry.name,
        };
      });
      break;

    default:
      break;
  }

  // Limit responses
  interaction.respond(results.slice(0, 25)).catch(() => {});
};
