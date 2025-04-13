import "dotenv/config";
import { ActivityType, Client, IntentsBitField } from "discord.js";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`${c.user.username} is online.`);

  client.user?.setActivity({
    name: "Hollow Knight",
    type: ActivityType.Playing,
    url: "https://store.steampowered.com/app/367520/Hollow_Knight",
  });
});

client.login(process.env.TOKEN);
