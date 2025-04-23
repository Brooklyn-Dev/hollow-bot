import { CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

import { ensureTextChannel } from "../utils/ensureTextChannel";
import { sendWithPreview } from "../utils/sendWithPreview";
import precepts from "../data/precepts.json";

const ZOTE_URL = "https://hollowknight.wiki/w/Zote";
const ZOTE_IMAGE_URL = "https://cdn.wikimg.net/en/hkwiki/images/5/5a/B_Zote.png";

export const data = new SlashCommandBuilder()
  .setName("precepts")
  .setDescription("Show infomation about a Zote precept (random if name unspecified).")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Name of the precept")
      .setRequired(false)
      .setAutocomplete(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  const channel = await ensureTextChannel(interaction);
  if (channel === null) return;

  const name = interaction.options.getString("name");

  let precept;
  if (name) {
    // Try to find the precept by name
    precept = precepts.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (!precept) {
      // If not found, send an ephemeral error message
      const errorEmbed = new EmbedBuilder()
        .setDescription(`No precept found with the name "${name}".`)
        .setColor("Red");

      return await interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  } else {
    // No name provided — select a random precept
    precept = precepts[Math.floor(Math.random() * precepts.length)];
  }

  // Create the embed with precept info
  const embed = new EmbedBuilder()
    .setTitle(precept.name)
    .setDescription(precept.description)
    .addFields({ name: "🔗 Wiki", value: `[${precept.name}](${ZOTE_URL})`, inline: true })
    .setThumbnail(ZOTE_IMAGE_URL)
    .setColor("Blue");

  await sendWithPreview(interaction, embed);
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
