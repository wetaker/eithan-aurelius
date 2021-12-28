import { Interaction } from 'discord.js'
import { SubscriberCollection } from './SubscriberCollection'


async function handleCommands(interaction : Interaction, subscribers : SubscriberCollection) {
    if (!interaction.isCommand()) return
    const { commandName } = interaction

    if (commandName === 'subscribe') {
        console.log(`Subscribing user ${interaction.user.tag}`)
        subscribers.addSubscriber(interaction.user.tag)
        await interaction.reply('You have successfully subscribed.')
    } else if (commandName === 'unsubscribe') {
        console.log(`Unsubscribing user ${interaction.user.tag}`)
        subscribers.removeSubscriber(interaction.user.tag)
        await interaction.reply('You have successfully unsubscribed.')
    }
    console.log(subscribers.subscribers)
}


export { handleCommands }