const { MongoClient } = require("mongodb");
const { connect } = require("../../routes/pets");
const uri = "mongodb+srv://admin:Icoh954202@cluster0.4sxqr.mongodb.net/test";
const client = new MongoClient(uri);

const mongoDBRequests = {
  insert: async (collectionName, data) => {
    try {
      await client.connect();
      const collection = client.db("best_pals").collection(collectionName);
      const res = await collection.insertOne({ ...data });
      return res;
    } finally {
      await client.close();
    }
  },
};

module.exports = mongoDBRequests;
