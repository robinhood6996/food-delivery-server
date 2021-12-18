const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 1111;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m62xz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('foos_delivery');
        const foodCollection = database.collection('food');


        app.post('/food', async (req, res) => {
            const food = req.body;
            const result = await foodCollection.insertOne(food);
            res.json(result);
        });


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

//31EVVnpcV2lQjU8K
//foodadmin
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})