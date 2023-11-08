const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
     const jobCollection = client.db("jobsDB").collection("jobs"); // AddJobs
     const contactCollection = client.db("jobsDB").collection("contacts"); // Contacts
      const appliedJobCollection = client.db("jobsDB").collection("appliedjobs"); // AppliedJobs
    // const blogsCollection = client.db("jobsDB").collection("blogs"); // Blogs

      // all post requests here
      app.post('/jobs', async (req, res) => {
        const newJob = req.body;
        // console.log(newJob); // checking if the data is coming or hitting (ok)
        const result = await jobCollection.insertOne(newJob);
        res.json(result);
      });

      app.post('/contacts', async (req, res) => {
        const newContact = req.body;
        // console.log(newContact); // checking if the data is coming or hitting (ok)
        const result = await contactCollection.insertOne(newContact);
        res.json(result);
      });

      app.post('/appliedjobs', async (req, res) => {
        const newAppliedJob = req.body;
        // console.log(newAppliedJob); // checking if the data is coming or hitting (ok)
        const result = await appliedJobCollection.insertOne(newAppliedJob);
        res.json(result);
      });

    // all get requests here
     app.get('/jobs', async (req, res) => {
      const cursor = jobCollection.find({});
      const jobs = await cursor.toArray();
      res.send(jobs);
    })

    // find operator  (get single job)
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const query = { _id: new ObjectId(id) };
      const job = await jobCollection.findOne(query);
      res.json(job);
    });

    app.get('/appliedjobs' , async (req, res) => {
      const cursor = appliedJobCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    })


    // delete operator (delete single job)
    app.delete('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.json(result);
    });

    // update operator (update single job)
    app.put('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const updatedJob = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateJobs = {
        $set: {
          banner: updatedJob.banner,
          cname: updatedJob.cname,
          title: updatedJob.title,
          category: updatedJob.category,
          salary: updatedJob.salary,
          date: updatedJob.date,
          description: updatedJob.description,
          postingDate: updatedJob.postingDate,
        },
      };
      const result = await jobCollection.updateOne(filter, updateJobs, options);
      res.json(result);
    });



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