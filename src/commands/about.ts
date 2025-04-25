import { CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { ensureTextChannel } from "../utils/ensureTextChannel";
import { version } from "../../package.json";

const GITHUB_URL = "https://github.com/Brooklyn-Dev/hollow-bot";
const GITHUB_ISSUES_URL = GITHUB_URL + "/issues";
const DEV_URL = "https://github.com/Brooklyn-Dev";
const WIKI_URL = "https://hollowknight.wiki/w/Hollow_Knight_Wiki";
const TEAM_CHERRY_URL = "https://www.teamcherry.com.au/";

export const data = new SlashCommandBuilder().setName("about").setDescription("About Hollow Bot.");

export async function run({ interaction }: SlashCommandProps) {
  const channel = await ensureTextChannel(interaction);
  if (channel === null) return;

  const embed = new EmbedBuilder()
    .setTitle("Hollow Bot")
    .setURL(GITHUB_URL)
    .setDescription(
      `A utility bot for Hollow Knight. Provides accurate, useful and fun information about the game content.\n\nAny errors or suggestions can be [reported here](${GITHUB_ISSUES_URL}).\n\nUse \`/help\` to see all available commands.\n\n__Credits:__`
    )
    .addFields(
      { name: "Brooklyn Dev", value: DEV_URL },
      { name: "Hollow Knight Wiki & Community", value: WIKI_URL },
      { name: "Team Cherry", value: TEAM_CHERRY_URL }
    )
    .setThumbnail(interaction.client.user.displayAvatarURL())
    .setFooter({ text: `Version ${version}` })
    .setColor("Blue");

  await interaction.reply({ embeds: [embed] });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
