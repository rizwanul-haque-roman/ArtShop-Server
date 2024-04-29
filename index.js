const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uzy5irc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("art_and_crafts");
    const drawingAndPainting = database.collection("drawingAndPainting");
    const subCategories = database.collection("subCategories");
    const testimonial = database.collection("testimonial");

    app.get("/featured", async (req, res) => {
      const query = { featured: "yes" };
      const cursor = drawingAndPainting.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/paintings", async (req, res) => {
      const cursor = drawingAndPainting.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/myPaintings", async (req, res) => {
      const email = req.query.email;
      //   console.log(email);
      const query = { user_email: email };
      const cursor = drawingAndPainting.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/testimonial", async (req, res) => {
      const cursor = testimonial.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/subCategories", async (req, res) => {
      const cursor = subCategories.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/paintings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await drawingAndPainting.findOne(query);
      res.send(result);
    });

    app.get("/subcategory/:subcategory", async (req, res) => {
      const subcategory = req.params.subcategory;
      console.log(subcategory);
      const query = { subcategory_Name: subcategory };
      const cursor = drawingAndPainting.find(query);
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });

    app.post("/paintings", async (req, res) => {
      const painting = req.body;
      const result = await drawingAndPainting.insertOne(painting);
      res.send(result);
    });

    app.put("/paintings/:id", async (req, res) => {
      const id = req.params.id;
      const painting = req.body;
      const filter = { _id: new ObjectId(id) };
      console.log(id);
      const options = { upsert: true };
      const updatedPainting = {
        $set: {
          image: painting.image,
          item_name: painting.item_name,
          subcategory_Name: painting.subcategory_Name,
          short_description: painting.short_description,
          price: painting.price,
          rating: painting.rating,
          customization: painting.customization,
          processing_time: painting.processing_time,
          stockStatus: painting.stockStatus,
        },
      };

      const result = await drawingAndPainting.updateOne(
        filter,
        updatedPainting,
        options
      );
      res.send(result);
    });

    app.delete("/paintings/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await drawingAndPainting.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
