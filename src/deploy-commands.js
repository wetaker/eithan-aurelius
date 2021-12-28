const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9");
require('dotenv').config();
// TODO: GLOBAL SETUP AFTER TESTING
const commands = [
  new SlashCommandBuilder()
    .setName("subscribe")
    .setDescription("Subscribe to time spent in channels tracking."),
  new SlashCommandBuilder()
    .setName("unsubscribe")
    .setDescription("Unsubscribe from channel time tracking."),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
rest
  .put(
    Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
    { body: commands }
  )
  .then(() => console.log("Successfully registered commands"))
  .catch(console.error);
