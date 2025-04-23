import { CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

import { ensureTextChannel } from "../utils/ensureTextChannel";
import { sendWithPreview } from "../utils/sendWithPreview";
import achievements from "../data/achievements.json";
import achievementCategories from "../data/achievementCategories.json";
import { getAchievementPercent } from "../utils/steamAchievements";

export const data = new SlashCommandBuilder()
  .setName("achievements")
  .setDescription("Show infomation about a Hollow Knight achievment (random if unspecified).")
  .addStringOption((option) =>
    option
      .setName("category")
      .setDescription("Category of the achievement")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Name of the achievement")
      .setRequired(false)
      .setAutocomplete(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  const channel = await ensureTextChannel(interaction);
  if (channel === null) return;

  const category = interaction.options.getString("category", true);
  const name = interaction.options.getString("name");

  // Filter achievements by the category
  const filtered = achievements.filter(
    (a: any) => a.category.toLowerCase() === category.toLowerCase()
  );
  let achievement;

  if (filtered.length === 0) {
    // If category not found, send an ephemeral error message
    const errorEmbed = new EmbedBuilder()
      .setDescription(`No category found with the name "${category}".`)
      .setColor("Red");

    return await interaction.reply({
      embeds: [errorEmbed],
      flags: MessageFlags.Ephemeral,
    });
  }

  if (name) {
    achievement = filtered.find((a: any) => a.name.toLowerCase() === name.toLowerCase());

    if (!achievement) {
      // If not found, send an ephemeral error message
      const errorEmbed = new EmbedBuilder()
        .setDescription(`No achivement found with the name "${name}" in ${category}.`)
        .setColor("Red");

      return await interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  } else {
    // No name provided — select a random achievement from filtered list
    achievement = filtered[Math.floor(Math.random() * filtered.length)];
  }

  const description = achievement.hidden
    ? `||${achievement.description}||`
    : achievement.description;

  // Create the embed with achievement info
  const embed = new EmbedBuilder()
    .setTitle(achievement.name)
    .setDescription(description)
    .setThumbnail(achievement.imageUrl)
    .setColor("Blue");

  const percent = getAchievementPercent(achievement.apiName);
  if (percent !== null) {
    embed.addFields({ name: "🏆 Completion Rate", value: `${percent}%`, inline: true });
  }

  const achievementCategory = achievementCategories.find(
    (c) => c.name.toLowerCase() === achievement.category.toLowerCase()
  );

  embed.addFields({
    name: "🔗 Wiki",
    value: `[${achievement.name}](${achievementCategory?.url})`,
    inline: true,
  });

  await sendWithPreview(interaction, embed);
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
