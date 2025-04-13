import "dotenv/config";
import { Client, IntentsBitField } from "discord.js";
import { CommandKit } from "commandkit";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
  ],
});

new CommandKit({
  client,
  devGuildIds: process.env.DEV_GUILD_IDS?.split(",") || [],
  devUserIds: process.env.DEV_USER_IDS?.split(",") || [],
  eventsPath: `${__dirname}/events`,
  commandsPath: `${__dirname}/commands`,
  bulkRegister: true,
});

client.login(process.env.TOKEN);
