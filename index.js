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
        const bookingCollection = database.collection('bookings')

        // get all offers api 
        app.get('/offers', async (req, res)=>{
            const cursor = offersCollection.find({});
            const result = await cursor.toArray();

            res.send(result);
        })

        //get api one offer by id
        app.get('/offer/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await offersCollection.findOne(query);

            res.send(result);

        })

        //get booking offer api
        app.post('/myOrder', async(req, res) =>{
            const userId = req.body;
            // const query = {};
            const result = await bookingCollection.find(userId).toArray();


            res.send(result)
        })

        //booking api 
        app.post('/booking', async (req, res) =>{
            booking = req.body;

            const result = await bookingCollection.insertOne(booking);

            res.json(result)
        })
        //delete booking api
        app.delete('/deleteBooking/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            
            res.json(result)
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
