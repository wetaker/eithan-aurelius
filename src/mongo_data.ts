import { MongoClient } from "mongodb";
import { records } from "./channel_logger";

async function addData(client : MongoClient, newRecords) {
    if (newRecords.length == 0) return;
    const database = client.db("Discord-bot")
    
    // Add channel switch events to DB
    const insert_result = await database.collection("channel_move_records").insertMany(newRecords);
    console.log(insert_result)

    // Update {user_id, channel_id, duration} collection 
    const durations = newRecords.map((x) => x.duration)
    let bulkUpdates = records.map(x => {
            return {updateOne: {
                filter: {'user_id': x.user_id, 'channel_id': x.channel_id},
                update: {$inc: {'duration': x.duration}},
                upsert: true
                }
            }
        });
    const update_result = await database.collection("user_channel_connection").bulkWrite(bulkUpdates);
    console.log(update_result)

};


export {addData}