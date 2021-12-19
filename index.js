//require('dotenv').config();
import {config as env_config} from 'dotenv';
env_config();
import logger from './ChannelSwitchLogger.js';
import { Client, Intents } from 'discord.js';
const token = process.env.TOKEN;


// New Client Instance
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES] 
});

client.once('ready', () => {
    console.log('Ready freddy!');
});

// Login
client.login(token)

logger(client)