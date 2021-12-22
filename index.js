//require('dotenv').config();
import {config as env_config} from 'dotenv';
env_config();
import { Client, Intents, VoiceState } from 'discord.js';
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


const activeData = new Map()
const completedData = new Map() 

const movedChannels = (oldVoiceState, newVoiceState) => {
    if (oldVoiceState.channelId === newVoiceState.channelId) {
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
    if (!completedData.has(id)) completedData[id] = []
    completedData[id].push(((new Date()).getTime() - activeData[id].getTime(), channelId))
    delete activeData[id]
}


client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.channelId === null) // Disconnected from server
        leftChannel(oldState)
    else if (oldState.channelId === null) // Connected to server
        enteredChannel(newState)
    else if (movedChannels(oldState, newState)) // Moved Channels
        leftChannel(oldState)
        enteredChannel(newState)
});

// const UPDATE_INTERVAL = 0.2 // Update interval in minutes
// setInterval(
//     () => {
//         console.log(activeData)
//         console.log(completedData)
//         // Push completedData to database
//         // Clear completedData
//     }, 
//     60*1000*UPDATE_INTERVAL)
