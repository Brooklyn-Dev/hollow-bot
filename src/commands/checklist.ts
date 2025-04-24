import { CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

import { ensureTextChannel } from "../utils/ensureTextChannel";
import { sendWithPreview } from "../utils/sendWithPreview";
import checklists from "../data/completionChecklists.json";

const COMPLETION_WIKI_URL = "https://hollowknight.wiki/w/Completion_(Hollow_Knight)";
const WORLD_SENSE_IMAGE_URL =
  "https://cdn.wikimg.net/en/hkwiki/images/thumb/d/d7/Icon_HK_World_Sense_Art.png/465px-Icon_HK_World_Sense_Art.png";

export const data = new SlashCommandBuilder()
  .setName("checklist")
  .setDescription("Show a static completion checklist (random if subcategory unspecified).")
  .addStringOption((option) =>
    option
      .setName("subcategory")
      .setDescription("Name of the subcategory")
      .setRequired(false)
      .setAutocomplete(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  const channel = await ensureTextChannel(interaction);
  if (channel === null) return;

  const subcategory = interaction.options.getString("subcategory");
  let checklist;

  if (subcategory) {
    // Try to find the checklist by subcategory
    checklist = checklists.find((c) => c.subcategory.toLowerCase() === subcategory.toLowerCase());
    if (!checklist) {
      // If not found, send an ephemeral error message
      const errorEmbed = new EmbedBuilder()
        .setDescription(`No checklist found with the subcategory "${subcategory}".`)
        .setColor("Red");

      return await interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  } else {
    // No name provided — select a random checklist
    checklist = checklists[Math.floor(Math.random() * checklists.length)];
  }

  let description = "";
  checklist.items.forEach((item) => {
    description += `${item.label} - ${item.percentage}%\n`;
  });

  const totalPercent = checklist.items.reduce((acc, item) => acc + item.percentage, 0);
  const wikiUrl = `${COMPLETION_WIKI_URL}#${checklist.subcategory.split(" ").join("_")}`;

  // Create the embed with checklist info
  const embed = new EmbedBuilder()
    .setTitle(`${checklist.category} - ${checklist.subcategory}`)
    .setDescription(description)
    .addFields(
      {
        name: "💯 Percentage",
        value: `Total ${totalPercent}%`,
        inline: true,
      },
      {
        name: "🔗 Wiki",
        value: `[${checklist.subcategory}](${wikiUrl})`,
        inline: true,
      }
    )
    .setThumbnail(WORLD_SENSE_IMAGE_URL)
    .setColor("Blue");

  await sendWithPreview(interaction, embed);
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
