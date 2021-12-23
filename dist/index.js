import { Client, Intents } from "discord.js";
import { addRecords } from '../src/mongo.ts/index.js';
import { config } from 'dotenv';
config();
const token = process.env.TOKEN;
// New Client Instance
const client = new Client({ intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});
client.once('ready', () => {
    console.log('Ready freddy!');
});
// Login
client.login(token);
// Data stores
const activeData = new Map();
const records = [];
const movedChannels = (old_id, new_id) => {
    if (old_id !== new_id) {
        return true;
    }
    else {
        return false;
    }
};
const enteredChannel = ({ id }) => {
    console.log("entered channel");
    activeData[id] = new Date();
};
const leftChannel = ({ id, channelId }) => {
    console.log("left channel");
    if (!(id in records)) {
        console.log('Initializing user');
        records[id] = [];
    }
    if (id in activeData) {
        records.push({
            '_id': id,
            'duration': new Date().getTime() - activeData[id].getTime(),
            'date': new Date(),
            'channel_id': channelId
        });
    }
    delete activeData[id];
};
const logChannelTimes = (oldState, newState) => {
    const { channelId: old_id } = oldState;
    const { channelId: new_id } = newState;
    if (new_id === null) { // Disconnected from server
        leftChannel(oldState);
    }
    else if (old_id === null) { // Connected to server
        enteredChannel(newState);
    }
    else if (movedChannels(old_id, new_id)) { // Moved Channels
        leftChannel(oldState);
        enteredChannel(newState);
    }
    console.log(activeData);
    console.log(records);
};
client.on('voiceStateUpdate', logChannelTimes);
const UPDATE_INTERVAL = 0.2; // Update interval in minutes
setInterval(() => {
    console.log(activeData);
    console.log(records);
    // Push records to database
    if (records.length == 0) return;
    addRecords(records);
    // Clear records
}, 60 * 1000 * UPDATE_INTERVAL);
