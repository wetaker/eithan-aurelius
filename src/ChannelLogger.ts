import {Snowflake, VoiceState} from 'discord.js'
import {SubscriberCollection} from './SubscriberCollection'


class ChannelTimeLogger {
    activeData = new Map<String, Date>();
    records : SubscriberCollection

    constructor(data : SubscriberCollection) {
        this.records = data
    }

    movedChannels = (old_vc_id : Snowflake, new_vc_id : Snowflake) => {
        if (old_vc_id !== new_vc_id) return true;
        else return false;
    }

    enteredChannel = (id) => {
        console.log("entered channel")
        this.activeData[id] = new Date()
    }


    leftChannel = (user_tag, {vs_id, channel}) => {
        console.log("left channel")
        if (!(vs_id in this.records)) {
            console.log('Initializing user')
            this.records.update(user_tag, channel.name, Date.now() - this.activeData.get(vs_id).getTime())
        }
        if (this.activeData.has(vs_id)) 
            delete this.activeData[vs_id]
    }

    logChannelTimes = (oldState : VoiceState, newState : VoiceState) => {
        const user_tag = oldState.member.user.tag
        const {channelId: old_id} = oldState
        const {channelId: new_id} = newState
        if (new_id === null) { // Disconnected from server
            this.leftChannel(user_tag, oldState.id)
        }
        else if (old_id === null) { // Connected to server
            this.enteredChannel(newState.id)
        }
        else if (this.movedChannels(old_id, new_id)) { // Moved Channels
            this.leftChannel(user_tag, oldState)
            this.enteredChannel(newState.id)
        }
        console.log(this.activeData)
        console.log(this.records)
    }
}

export { ChannelTimeLogger }
