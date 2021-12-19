const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const objectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 1111;
const fileUpload = require('express-fileupload');

app.use(cors());
app.use(express.json());
app.use(fileUpload());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m62xz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('foos_delivery');
        const foodCollection = database.collection('food');
        const userCollection = database.collection('users');
        const orderCollection = database.collection('order');


        app.post('/food', async (req, res) => {
            // const food = req.body;

            console.log('body', req.body);
            console.log('files', req.files);
            const name = req.body.name;
            const price = req.body.price;
            const ing = req.body.ing;
            const desc = req.body.desc;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const food = {
                name,
                price,
                ing,
                desc,
                image: imageBuffer
            }
            const result = await foodCollection.insertOne(food);
            res.json(result);
        });

        app.get('/food', async (req, res) => {
            const cursor = foodCollection.find({});
            const food = await cursor.toArray();
            res.send(food);
        });

        app.get('/food/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: objectId(id) };
            const result = await foodCollection.findOne(query);
            res.json(result);
        })

        //Users API
        app.post('/users', async (req, res) => {
            const email = req.body.email;
            const name = req.body.displayName;
            const phone = req.body.phone;
            const location = req.body.location;
            const user = {
                name,
                email,
                phone,
                location,
                isAdmin: false
            }
            const result = await userCollection.insertOne(user);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = { ...req.body, isAdmin: false };
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.json(result);
        })

        //Order API
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
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