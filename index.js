const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ivpd0t4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
         client.connect();

        const toyCollection = client.db('autixir').collection('addToy');

        app.post('/addToy', async (req, res) => {
            const newAddToy = req.body;
            const result = await toyCollection.insertOne(newAddToy)
            res.send(result)
        })

        app.get('/addToy', async (req, res) => {
            const cursor = toyCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/addToy/email', async (req, res) => {
            //console.log(req.query)
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            // console.log(query)
            const result = await toyCollection.find(query).toArray()
            res.send(result)
        })
       


        app.delete('/addToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query)
            res.send(result)
        })


        app.get('/addToy/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query)
            res.send(result)
        })

        app.put('/addToy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const toy = req.body;
            const updatedToy = {
                $set: {
                    price: toy.price,
                    detailsDescription: toy.detailsDescription,
                    availableQuantity: toy.availableQuantity,
                }
            };
            const result = await toyCollection.updateOne(filter, updatedToy, option);
            res.send(result);
        });






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Autixir Running!')
})

app.listen(port, () => {
    console.log(`Autixir Running on port ${port}`)
})