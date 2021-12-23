import { VoiceState, Client, Intents, Snowflake } from "discord.js";
import { config } from 'dotenv'
import { MongoClient } from "mongodb";
config()
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

// Data stores
const activeData = new Map<String, Date>()
const records = [];

const movedChannels = (old_id : Snowflake, new_id : Snowflake) => {
    if (old_id !== new_id) {
        return true;
    } else {
        return false;
    }
};
const enteredChannel = ({id}) => {
    console.log("entered channel")
    activeData[id] = new Date()
}

const leftChannel = ({id, channelId}) => {
    console.log("left channel")
    if (!(id in records)) {
        console.log('Initializing user')
        records[id] = []
    }
    if (id in activeData) {
            records.push({
            'user_id': id,
            'duration': new Date().getTime() - activeData[id].getTime(),
            'date': new Date(),
            'channel_id': channelId
        })
    }
    delete activeData[id]
}

const logChannelTimes = (oldState : VoiceState, newState : VoiceState) => {
    const {channelId: old_id} = oldState
    const {channelId: new_id} = newState
    if (new_id === null) { // Disconnected from server
        leftChannel(oldState)
    }
    else if (old_id === null) { // Connected to server
        enteredChannel(newState)
    }
    else if (movedChannels(old_id, new_id)) { // Moved Channels
        leftChannel(oldState)
        enteredChannel(newState)
    }
    console.log(activeData)
    console.log(records) 
}
async function _addData(client, newRecords) {
    if (newRecords.length == 0) return;
    const result = await client.db("Discord-bot")
    .collection("user_channel_durations")
    .insertMany(newRecords);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
}

const db_client = new MongoClient(process.env.DB_URI)
try {
    db_client.connect();
} catch (e) {
    console.error(e)
}


client.on('voiceStateUpdate', logChannelTimes);

const UPDATE_INTERVAL = 0.2 // Update interval in minutes
setInterval(
    async () => {
        console.log(activeData)
        console.log(records)
        // Push records to database
        await _addData(db_client, records)
        // Clear records
    }, 
    60*1000*UPDATE_INTERVAL)


