import { MongoClient } from "mongodb";

const url = "mongodb://mongo:27017";
const client = new MongoClient(url);
const dbName = "pizzadb";

export async function initializeDatabase() {
  await client.connect();
  const db = client.db(dbName);
  await db.createCollection("orders");
}

export async function insertOrder(
  id: string,
  receivedAt: number,
  servedAt: number
) {
  const db = client.db(dbName);
  const orders = db.collection("orders");
  await orders.insertOne({ id, receivedAt, servedAt });
}
