const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middlewere
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "welcome to e labour." });
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("e-labour");
    const labourCollections = database.collection("labourers");

    app.post("/labours", async (req, res) => {
      try {
        const labourInfo = req.body;
        console.log(labourInfo);

        const result = await labourCollections.insertOne(labourInfo);
        res.json(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/labours",async(req,res)=>{
      try {

        const cursor=labourCollections.find()
        const result=await cursor.toArray()
        res.json(result)
        
      } catch (error) {
        console.log(error)
      }
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is connected on port ${port}`);
});
