import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

console.log("test");

try {
   await client.connect();
   await client.db("admin").command({ ping: 1 });
   console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
   );
} catch (err) {
   console.error(err);
}

let db = client.db("projecta");

const collections = await db.listCollections().toArray();
console.log("Collections:", collections);

export default db;
