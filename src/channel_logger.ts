import {Snowflake, VoiceState} from 'discord.js'

const activeData = new Map<String, Date>();
let records = [];

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


export {logChannelTimes, records}