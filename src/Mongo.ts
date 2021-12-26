import { MongoClient } from "mongodb";
import { config } from 'dotenv'
config()

const MongoConnection = (() => {
    const client : MongoClient = new MongoClient(process.env.DB_URI)
    function getClient() {return client}

    async function connect() {
        await client.connect()
    }

    async function syncWithDB(data: any) {
        let client = getClient()
        
        let bulkUpdates = data.map(x => {
            return {updateOne: {
                filter: {'user_id': x.user_id},
                update: {$set: {
                    'user_id': x.tag,
                    'channels': x.channels,
                    'work_per_day': x.work_per_day
                }},
                upsert: true
            }}
        })
    }

    async function getSubscribers() { 
            console.log('Getting Subscribers from DB')
            const cursor = getClient().db('Discord-bot').collection('subscribers').find()
            let data = await cursor.toArray()
            return data
    }
    return {connect, getSubscribers}

})()

export { MongoConnection }