import { CommandOptions, SlashCommandProps } from "commandkit";
import { EmbedBuilder, Message, MessageFlags, SlashCommandBuilder, TextChannel } from "discord.js";

import { addUsageFooter } from "../utils/addUsageFooter";
import { ensureTextChannel } from "../utils/ensureTextChannel";
import { formatHint1, formatHint2 } from "../utils/geoguessr/formatHints";
import { getRandomLocation } from "../utils/geoguessr/getRandomLocation";

import { GeoguessrMode, EntryType } from "../types/geoguessrTypes";
import modes from "../data/geoguessrModes.json";

const GEOGUESSR_MODES = modes as GeoguessrMode[];
const TIME_TO_ANSWER = 21; // in seconds

export const data = new SlashCommandBuilder()
  .setName("geoguessr")
  .setDescription(
    "Guess the Hollow Knight location from a random image from a mode (everything if mode unspecified)."
  )
  .addStringOption((option) =>
    option
      .setName("mode")
      .setDescription("Name of the mode")
      .setRequired(false)
      .setAutocomplete(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  const channel = await ensureTextChannel(interaction);
  if (channel === null) return;

  const inputMode = interaction.options.getString("mode") as EntryType;

  let mode: GeoguessrMode | undefined;
  if (inputMode) {
    // Try to find the mode by name
    mode = GEOGUESSR_MODES.find((m) => m.name.toLowerCase() === inputMode.toLowerCase());
    if (!mode) {
      // If not found, send an ephemeral error message
      const errorEmbed = new EmbedBuilder()
        .setDescription(`No mode found with the name "${inputMode}".`)
        .setColor("Red");

      return await interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  } else {
    // No mode provided — select everything mode
    mode = GEOGUESSR_MODES.filter((m) => m.name.toLowerCase() === "everything")[0];
  }

  const location = getRandomLocation(mode.categories);

  const hint1 = formatHint1(location.name);
  const hint2 = formatHint2(location.name);

  const promptByCategory: Record<EntryType, string> = {
    area: "Guess the area shown.",
    boss: "Which boss is fought here?",
    charm: "Which charm is found here?",
    specialRoom: "What special room is this?",
    landmark: "Guess the landmark location.",
    subarea: "Identify the subarea.",
  };

  const baseDescription = `Type your guess below!\n\nHint 1: ||**\`${hint1}\`**||\n\nHint 2: ||**\`${hint2}\`**||`;

  const endTimestamp = Math.floor(Date.now() / 1000) + TIME_TO_ANSWER + 1;
  const embed = new EmbedBuilder()
    .setTitle("Hollow Knight Geoguessr")
    .setDescription(
      `${promptByCategory[location.type]} ${baseDescription}\n\nEnds <t:${endTimestamp}:R>.`
    )
    .setImage(location.imageUrl)
    .setColor("Blue");

  addUsageFooter(embed, interaction);

  await interaction.reply({
    embeds: [embed],
  });

  const replyMessage = (await interaction.fetchReply()) as Message;

  const filter = (msg: Message) => msg.author.id === interaction.user.id && !msg.author.bot;
  const textChannel = channel as TextChannel;

  const collector = textChannel.createMessageCollector({
    filter,
    time: TIME_TO_ANSWER * 1000,
    max: 1,
  });

  const sanitise = (input: string): string =>
    input.toLowerCase().normalize("NFKD").replace(/\s+/g, " ").trim();

  collector.on("collect", async (msg) => {
    const guess = sanitise(msg.content);
    const answer = sanitise(location.name);

    collector.stop(guess === answer ? "correct" : "incorrect");
  });

  collector.on("end", async (collected, reason) => {
    const updatedEmbed = embed.setDescription(
      `${promptByCategory[location.type]} ${baseDescription}`
    );
    let responseEmbed = new EmbedBuilder();

    await replyMessage.edit({
      embeds: [updatedEmbed],
    });

    // Timeout
    if (collected.size === 0) {
      responseEmbed = responseEmbed
        .setDescription(
          `Time's up! No guess was made. The correct answer was ||**${location.name}**||.`
        )
        .setColor("Red");
    } else if (reason === "correct") {
      responseEmbed = responseEmbed
        .setDescription(`Correct! That was **${location.name}**.`)
        .setColor("Green");
    } else if (reason === "incorrect") {
      responseEmbed = responseEmbed
        .setDescription(`Incorrect! The correct answer was ||**${location.name}**||.`)
        .setColor("Red");
    }

    if (responseEmbed !== new EmbedBuilder())
      await interaction.followUp({
        embeds: [responseEmbed],
      });
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
