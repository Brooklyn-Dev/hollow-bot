import { CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { ensureTextChannel } from "../utils/ensureTextChannel";
import { sendWithPreview } from "../utils/sendWithPreview";
import charms from "../data/charms.json";
import { getRandomCharmLoadout } from "../utils/getRandomCharmLoadout";
import { generateLoadoutImage } from "../utils/generateLoadoutImage";

const MIN_NOTCHES = 3;
const MAX_NOTCHES = 11;

export const data = new SlashCommandBuilder()
  .setName("random-charms")
  .setDescription("Generate a random charm loadout.")
  .addIntegerOption((option) =>
    option
      .setName("notches")
      .setDescription("Maximum notches to use")
      .setRequired(false)
      .setMinValue(MIN_NOTCHES)
      .setMaxValue(MAX_NOTCHES)
  )
  .addBooleanOption((option) =>
    option.setName("overcharm").setDescription("Whether to allow overcharming").setRequired(false)
  );

export async function run({ interaction }: SlashCommandProps) {
  const channel = await ensureTextChannel(interaction);
  if (channel === null) return;

  const maxNotches = interaction.options.getInteger("notches") ?? MAX_NOTCHES;
  const allowOvercharm = interaction.options.getBoolean("overcharm") ?? false;

  // Filter valid charms
  const validCharms = charms.filter((charm) => {
    if (charm.id === "12") return false; // Ignore Unbreakaable Heart
    if (charm.id === "14") return false; // Ignore Unbreakable Greed
    if (charm.id === "16") return false; // Ignore Unbreakable Strength
    if (charm.id === "44") return false; // Ignore Kingsoul
    if (charm.id === "45") return false; // Ignore Void Heart
    return true;
  });

  const { selected, totalNotches } = getRandomCharmLoadout(validCharms, maxNotches, allowOvercharm);

  const loadoutImage = await generateLoadoutImage(selected);

  let description = "";
  selected.forEach((charm) => {
    description += `${charm.name} - ${charm.notches} Notch${
      Number(charm.notches) > 1 ? "es" : ""
    }\n`;
  });

  const embed = new EmbedBuilder()
    .setTitle("Random Charm Loadout")
    .setDescription(description)
    .addFields(
      { name: "🔩 Notches Used", value: `${totalNotches}/${maxNotches}`, inline: true },
      { name: "🎭 Overcharm Allowed", value: allowOvercharm ? "Yes" : "No", inline: true }
    )
    .setColor("Blue");

  await sendWithPreview(interaction, embed, [loadoutImage]);
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
