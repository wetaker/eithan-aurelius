import { Client, Intents } from 'discord.js'
import { MongoConnection } from './Mongo'
import { SubscriberCollection } from './SubscriberCollection';
import { ChannelTimeLogger } from './ChannelLogger'
import { handleCommands } from './interact-commands'

const UPDATE_INTERVAL = 0.2 // Update interval in minutes

async function main() {
    const discord_client = new Client({ intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_VOICE_STATES] 
        });

    discord_client.on('ready', () => console.log('Connected'))
    discord_client.login(process.env.TOKEN)

    // Connect to DB and fetch subscribers
    await MongoConnection.connect()
    let subscribers = new SubscriberCollection(JSON.parse(JSON.stringify(
        await MongoConnection.getSubscribers())))

    // Log channel changes
    const logger = new ChannelTimeLogger(subscribers)
    discord_client.on('voiceStateUpdate', logger.logChannelTimes);


    // Listen for commands
    discord_client.on('interactionCreate', (interaction) => handleCommands(interaction, subscribers))

    // Update database
    setInterval(
        async () => {
            await MongoConnection.syncWithDB(logger.records)
        }, 
        60*1000*UPDATE_INTERVAL)

}

main()