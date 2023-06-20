const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rvg3x0p.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnect = async () => {
  try {
      await client.connect()
      console.log('Database Connected!')
  } catch (error) {
      console.log(error.name, error.message)
  }
}
dbConnect()

const usersCollection = client.db("usersManagement").collection("users");
app.get("/", (req, res) => {
  res.send("users are connected");
});

app.post("/users", async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  const existUser = await usersCollection.findOne(query);
  if (existUser) {
    return res.send({ message: "user already exists" });
  }
  const result = await usersCollection.insertOne(user);
  res.send(result);
});

app.get("/users", async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await usersCollection.findOne(query);
  res.send(result);
});

app.put("/usersUpdate/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const updatedUser = req.body;
  const user = {
    $set: {
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    },
  };
  const result = await usersCollection.updateOne(query, user);
  res.send(result);
});

app.delete("/usersDelete/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
});

app.listen(port, () => {
  console.log(`users are connected on port ${port}`);
});
