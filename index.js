const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Setup MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpaaohj.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

     // Establish DB and verify connection
     const jobCollection = client.db("jobsDB").collection("jobs");

      // all post requests here
      app.post('/jobs', async (req, res) => {
        const newJob = req.body;
        // console.log(newJob); // checking if the data is coming or hitting (ok)
        const result = await jobCollection.insertOne(newJob);
        res.json(result);
      });

    // all get requests here





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// Running Server
app.get('/', (req, res) => {
    res.send('Job World Api is Running!!');
});
// Listen
app.listen(port, () => {
    console.log(`Job World Server is running on port ${port}`);
});