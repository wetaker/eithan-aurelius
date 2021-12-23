import { Client, Intents } from 'discord.js'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import {logChannelTimes, records} from './channel_logger'
import {addData} from './mongo_data'
config()

// Connect to discord
const discord_client = new Client({ intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES] 
    });

discord_client.on('ready', () => console.log('Connected'))
discord_client.login(process.env.TOKEN)

// Connect to DB
const mongo_client = new MongoClient(process.env.DB_URI)
mongo_client.connect()


// Log channel changes
discord_client.on('voiceStateUpdate', logChannelTimes);

// Update database
const UPDATE_INTERVAL = 0.2 // Update interval in minutes
setInterval(
    async () => {
        await addData(mongo_client, records)
        records.length = 0
    }, 
    60*1000*UPDATE_INTERVAL)


