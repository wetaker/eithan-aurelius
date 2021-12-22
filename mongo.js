import { MongoClient } from 'mongodb'

async function main() {
    const uri = "mongodb+srv://wetaker:<password>@cluster0.oc4e2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();


}