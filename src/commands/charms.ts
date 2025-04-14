import { CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

import { sendWithPreview } from "../utils/sendWithPreview";
import charms from "../data/charms.json";

export const data = new SlashCommandBuilder()
  .setName("charms")
  .setDescription("Show information about a Hollow Knight charm (random if name is not specified).")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Name of the charm")
      .setRequired(false)
      .setAutocomplete(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  const name = interaction.options.getString("name");

  let charm;
  if (name) {
    // Try to find the charm by name
    charm = charms.find((c) => c.name.toLowerCase() === name.toLowerCase());

    if (!charm) {
      // If not found, send an ephemeral error message
      return await interaction.reply({
        content: `❌ No charm found with the name "${name}".`,
        flags: MessageFlags.Ephemeral,
      });
    }
  } else {
    // No name provided — select a random charm
    charm = charms[Math.floor(Math.random() * charms.length)];
  }

  // Create the embed with charm info
  const embed = new EmbedBuilder()
    .setTitle(`Charm: ${charm.name}`)
    .setDescription(charm.description)
    .addFields(
      { name: "📍 Location", value: `||${charm.location}||` || "Unknown", inline: true },
      { name: "🔩 Notches", value: charm.notches || "?", inline: true },
      { name: "🔗 Wiki", value: `[${charm.name}](${charm.url})`, inline: true }
    )
    .setThumbnail(charm.imageUrl)
    .setColor("Blue");

  await sendWithPreview({ interaction, embed });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
