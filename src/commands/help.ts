import { CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

import { ensureTextChannel } from "../utils/ensureTextChannel";
import { version } from "../../package.json";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("List of Hollow Bot Commands.");

export async function run({ interaction }: SlashCommandProps) {
  const channel = await ensureTextChannel(interaction);
  if (channel === null) return;

  const embed = new EmbedBuilder()
    .setTitle("Hollow Bot - List of Commands")
    .setDescription(
      "A utility bot for Hollow Knight. Provides accurate, useful and fun information about the game content.\n\n"
    )
    .addFields(
      { name: "• Show information about the bot", value: "`/about`" },
      {
        name: "• Achievement descriptions and information",
        value: "`/achivements [category] [name?]`",
      },
      { name: "• Charm descriptions and information", value: "`/charms [name?]`" },
      { name: "• Completion checklists", value: "`/checklist [subcategory?]`" },
      { name: "• Hollow Knight geoguessr", value: "`/geoguessr [mode?]`" },
      { name: "• Hunter's Journal entries", value: "`/journal [name?]`" },
      { name: "• Zote's precepts dialogue", value: "`/precepts [name?]`" },
      {
        name: "• Generate a random charm Loadout",
        value: "`/random-charms [notches?] [overcharm?]`",
      }
    )
    .setThumbnail(interaction.client.user.displayAvatarURL())
    .setFooter({ text: `Version ${version}\nHollow Bot made by Brooklyn Dev` })
    .setColor("Blue");

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
