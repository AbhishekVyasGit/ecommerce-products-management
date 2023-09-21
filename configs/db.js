
import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "mongodb://localhost:27017/crud";

const client = new MongoClient(connectionString);

let conn;

try {

  conn = await client.connect();

  console.log("connect to database");

} catch (e) {
  console.error(e);
}

let db = conn.db("crud");

export default db;