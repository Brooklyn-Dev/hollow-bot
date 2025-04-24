import { Interaction } from "discord.js";

import achievements from "../../data/achievements.json";
import achievementCategories from "../../data/achievementCategories.json";
import charms from "../../data/charms.json";
import checklists from "../../data/completionChecklists.json";
import geoguessrModes from "../../data/geoguessrModes.json";
import journal from "../../data/journal.json";
import precepts from "../../data/precepts.json";

module.exports = (interaction: Interaction) => {
  if (!interaction.isAutocomplete()) return;

  const focusedOption = interaction.options.getFocused(true);
  const focusedName = focusedOption.name.toLowerCase();
  const focusedValue = focusedOption.value.toLowerCase();

  let results: { name: string; value: string }[] = [];

  switch (interaction.commandName) {
    case "achievements":
      switch (focusedName) {
        case "category":
          results = achievementCategories
            .filter((achievementCategory) =>
              achievementCategory.name.toLowerCase().includes(focusedValue)
            )
            .map((choice) => ({
              name: choice.name,
              value: choice.name,
            }));
          break;

        case "name":
          const category = interaction.options.getString("category", true);

          results = achievements
            .filter(
              (achievement) =>
                achievement.category.toLowerCase() === category.toLowerCase() &&
                achievement.name.toLowerCase().includes(focusedValue)
            )
            .map((choice) => ({
              name: choice.name,
              value: choice.name,
            }));
          break;
      }
      break;

    case "charms":
      results = charms
        .filter((charm) => charm.name.toLowerCase().includes(focusedValue))
        .map((choice) => ({
          name: choice.name,
          value: choice.name,
        }));
      break;

    case "checklist":
      results = checklists
        .filter((checklist) => checklist.subcategory.toLowerCase().includes(focusedValue))
        .map((choice) => ({
          name: choice.subcategory,
          value: choice.subcategory,
        }));
      break;

    case "geoguessr":
      results = geoguessrModes
        .filter((mode) => mode.name.toLowerCase().startsWith(focusedValue))
        .map((choice) => ({ name: choice.name, value: choice.name }));
      break;

    case "journal":
      results = journal
        .filter((entry) => entry.name.toLowerCase().includes(focusedValue))
        .map((choice) => ({
          name: choice.name,
          value: choice.name,
        }));
      break;

    case "precepts":
      results = precepts
        .filter((precept) => precept.name.toLowerCase().includes(focusedValue))
        .map((choice) => ({
          name: choice.name,
          value: choice.name,
        }));
      break;

    default:
      break;
  }

  // Limit responses
  interaction.respond(results.slice(0, 25)).catch(() => {});
};
