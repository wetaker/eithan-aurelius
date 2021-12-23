import { MongoClient } from 'mongodb';
import {config} from 'dotenv';
config();

async function _addData(client, newRecords) {
    if (newRecords.length == 0) return;
    const result = await client.db("discord-bot")
    .collection("user_channel_durations")
    .insertMany(newRecords);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
}

async function addRecords(records){
    const uri = process.env.DB_URI
    const client = new MongoClient(uri);
 
    try {
        await client.connect();
        _addData(client, records)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

export {addRecords} 