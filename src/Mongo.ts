import { MongoClient } from "mongodb";
import { config } from 'dotenv'
import { Subscriber, SubscriberCollection } from './SubscriberCollection'
config()

const MongoConnection = (() => {
    const client : MongoClient = new MongoClient(process.env.DB_URI)
    function getClient() {return client}

    async function connect() {
        await client.connect()
    }

    async function syncWithDB(records: SubscriberCollection) {
        let client = getClient()
        
        console.log('Syncing with database')
        let subs = Array.from(records.subscribers.values())
        console.log(subs)

        let bulkUpdates = subs
        .map((x : Subscriber) => {
            return {updateOne: {
                filter: {'tag': x.tag},
                update: {$set: {
                    'tag': x.tag,
                    'data': {
                        'channels': Object.fromEntries(x.data.channels),
                        'work_per_day': Object.fromEntries(x.data.work_by_day),
                        'total_duration' : x.data.total_duration
                    }
                }},
                upsert: true
            }}
        })
        if (bulkUpdates.length > 0) client.db('Discord-bot').collection('subscribers').bulkWrite(bulkUpdates)
    }

    async function getSubscribers() { 
            console.log('Getting Subscribers from DB:')
            const cursor = getClient().db('Discord-bot').collection('subscribers').find()
            let data = await cursor.toArray()
            console.log(data)
            return data
    }
    return {connect, getSubscribers, syncWithDB}

})()

export { MongoConnection }