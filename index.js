const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rvg3x0p.mongodb.net/?retryWrites=true&w=majority`;

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
    const usersCollection = client.db('usersManagement').collection('users')

    app.post('/users', async(req, res)=>{
        const user = req.body 
        const query = { email: user.email}
        const existUser = await usersCollection.findOne(query)
        if(existUser){
                return res.send({message: 'user already exists'})
        }
        const result = await usersCollection.insertOne(user)
        res.send(result)
    })

    app.get('/users', async(req, res)=>{
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.findOne(query)
      res.send(result)
    })

    app.put('/usersUpdate/:id', async(req, res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const updatedUser = req.body
      const user = {
        $set:{
          name:updatedUser.name,
          email:updatedUser.email,
          phone:updatedUser.phone
        }
      }
      const result = await usersCollection.updateOne(query, user)
      res.send(result)
    })

    app.delete('/usersDelete/:id', async(req, res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
        res.send('users are connected')
})

app.listen(port, ()=>{
        console.log(`users are connected on port ${port}`)
})