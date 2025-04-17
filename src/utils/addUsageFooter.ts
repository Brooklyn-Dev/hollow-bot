import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export function addUsageFooter(embed: EmbedBuilder, interaction: ChatInputCommandInteraction) {
  //  Get the command used (e.g. "/charms name: Wayward Compass")
  const commandName = `/${interaction.commandName}`;
  const options = interaction.options.data.map((opt) => `${opt.name}: ${opt.value}`).join(" ");
  const fullCommand = options ? `${commandName} ${options}` : commandName;

  // Set embed footer showing who used "what" command
  embed.setFooter({
    text: `@${interaction.user.username} used ${fullCommand}`,
    iconURL: interaction.user.displayAvatarURL(),
  });

  return embed; // Allow chaining
}
