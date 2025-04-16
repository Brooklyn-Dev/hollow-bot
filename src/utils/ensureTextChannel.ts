import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, TextChannel } from "discord.js";

export async function ensureTextChannel(
  interaction: ChatInputCommandInteraction
): Promise<TextChannel | null> {
  const channel = interaction.channel;

  if (!channel?.isTextBased()) {
    const embed = new EmbedBuilder()
      .setDescription("This command can only be used in a text channel.")
      .setColor("Red");

    await interaction.followUp({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });

    return null;
  }

  return channel as TextChannel;
}
