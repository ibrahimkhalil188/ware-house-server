const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


require('dotenv').config()
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dnjxk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const mobileCollection = client.db("MobileLand").collection("Mobile");


        app.get("/allproducts", async (req, res) => {
            const query = {}
            const limit = parseInt(req.query.limit)
            const cursor = mobileCollection.find(query)
            if (!limit) {
                const result = await cursor.toArray()
                res.send(result)
            } else {
                const result = await cursor.limit(limit).toArray()
                res.send(result)
            }

        })

        app.get("/allproducts/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const cursor = mobileCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post("/allproducts", async (req, res) => {
            const data = req.body
            const result = await mobileCollection.insertOne(data)
            res.send(result)
        })

        app.delete("/allproducts/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await mobileCollection.deleteOne(query)
            res.send(result)
        })

        app.put("/allproducts/:id", async (req, res) => {
            const id = req.params.id
            const data = req.body
            console.log(data)
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    quantity: data.quantity,
                    sold: data.sold
                },
            }
            const result = await mobileCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })


    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir)


app.get("/", (req, res) => {
    res.send("look mama Mobile Land server")

})

app.listen(port, () => {
    console.log("Mobile Land Warehouse", port)
})