import { ActivityType, Client } from "discord.js";

module.exports = (client: Client) => {
  if (client.user !== null) {
    console.log(`${client.user.username} is online.`);
  }

  client.user?.setActivity({
    name: "Hollow Knight",
    type: ActivityType.Playing,
    url: "https://store.steampowered.com/app/367520/Hollow_Knight",
  });
};
