const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqqvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        console.log("connection success")

        const database = client.db("SD_Travel_Agency");
        const offersCollection = database.collection('offers');

        app.get('/offers', async (req, res)=>{
            const cursor = offersCollection.find({});
            const result = await cursor.toArray();

            res.send(result);
        })


    }finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) =>{
    res.send("SD Travel Agency");
})

app.listen(port, ()=>{
    console.log("Listening port: ", port);
})
