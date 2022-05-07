const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');


require('dotenv').config()
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dnjxk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const mobileCollection = client.db("MobileLand").collection("Mobile");

        app.get("/home", async (req, res) => {
            const query = {}
            const cursor = mobileCollection.find(query)
            const result = await cursor.toArray()
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