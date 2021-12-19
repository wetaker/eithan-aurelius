
const movedChannels = (oldVoiceState, newVoiceState) => {
    if (oldVoiceState.channelID === newVoiceState.channelID) {
        return true;
    } else {
        return false;
    }
};

const getTimeAndChannel = (client) => {
    client.on('voiceStateUpdate', (oldState, newState) => {
        console.log(newState);
        console.log(oldState);
        if (newState.channelID === null)
            console.log('Left Channel');
        else if (oldState.channelID === null)
            console.log('Joined channel');
        else if (movedChannels(oldState, newState))
            console.log('Moved channels');
    });
};


export default getTimeAndChannel;