import { CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("ping").setDescription("Pong!");

export function run({ interaction, client }: SlashCommandProps) {
  const embed = new EmbedBuilder()
    .setTitle("Pong!")
    .setDescription(`:ping_pong: ${client.ws.ping}ms`)
    .setColor("Blue");

  interaction.reply({ embeds: [embed] });
}

export const options: CommandOptions = {
  devOnly: true,
  deleted: false,
};
