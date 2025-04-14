import { CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

import { sendWithPreview } from "../utils/sendWithPreview";
import journal from "../data/journal.json";

export const data = new SlashCommandBuilder()
  .setName("journal")
  .setDescription(
    "Show Hunter's Journal description and notes about a journal entry (random if name is not specified)."
  )
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Name of the journal entry")
      .setRequired(false)
      .setAutocomplete(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  const name = interaction.options.getString("name");

  let entry;
  if (name) {
    // Try to find the journal entry by name
    entry = journal.find((e) => e.name.toLowerCase() === name.toLowerCase());

    if (!entry) {
      // If not found, send an ephemeral error message
      const errorEmbed = new EmbedBuilder()
        .setDescription(`No journal entry found with the name "${name}".`)
        .setColor("Red");

      return await interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  } else {
    // No name provided — select a random journal entry
    entry = journal[Math.floor(Math.random() * journal.length)];
  }

  // Create the embed with charm info
  const embed = new EmbedBuilder()
    .setTitle(`Hunter's Journal: ${entry.name}`)
    .addFields(
      { name: "**Description:**", value: `${entry.description}` || "Unknown", inline: false },
      { name: "**Hunter's notes:**", value: `${entry.notes}` || "Unknown", inline: false },
      { name: "🔗 Wiki", value: `[${entry.name}](${entry.url})`, inline: false }
    )
    .setThumbnail(entry.imageUrl)
    .setColor("Blue");

  await sendWithPreview({ interaction, embed });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
