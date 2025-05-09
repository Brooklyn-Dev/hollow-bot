import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  InteractionResponse,
  Interaction,
  MessageFlags,
  AttachmentBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { addUsageFooter } from "./addUsageFooter";

/**
 * Sends an ephemeral preview of an embed with a "Send this message" button.
 * Once the button is clicked, the message is published publicly and the button is disabled.
 */
export async function sendWithPreview(
  interaction: ChatInputCommandInteraction,
  embed: EmbedBuilder,
  files?: AttachmentBuilder[] | null
) {
  addUsageFooter(embed, interaction);

  // Create button to send message
  const button = new ButtonBuilder()
    .setCustomId("send-button")
    .setLabel("Send this message")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

  // Send the ephemeral preview message with the embed and button
  const reply: InteractionResponse = await interaction.reply({
    content: "**Preview** - Send this message?",
    embeds: [embed],
    components: [row],
    files: files || [],
    flags: MessageFlags.Ephemeral,
  });

  // Only allow the original user to interact with the button
  const filter = (i: Interaction) => i.user.id === interaction.user.id;

  // Set up a collector that waits for the user to click the button once
  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter,
    max: 1,
  });

  collector.on("collect", async (i) => {
    if (i.customId === "send-button") {
      // Disable the button in the original ephemeral message
      const disabledButton = ButtonBuilder.from(button).setDisabled(true);
      const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(disabledButton);

      await i.update({
        components: [disabledRow],
      });

      // Send the embed publicly
      await i.followUp({
        embeds: [embed],
        files: files || [],
        components: [],
      });
    }
  });
}
