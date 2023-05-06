import { Collection, MongoClient } from "mongodb";
import { Order, Pizza } from "./models";

const url = "mongodb://mongo:27017";
const client = new MongoClient(url);
const dbName = "pizzadb";
let ordersCollection: Collection<Order>;

export async function initializeDatabase() {
  await client.connect();
  const db = client.db(dbName);
  ordersCollection = db.collection("orders");
}

export async function findOrder(id: string) {
  return await ordersCollection.findOne({ _id: id });
}

export async function insertOrder(id: string, receivedAt: number) {
  await ordersCollection.insertOne({
    _id: id,
    pizzas: [],
    receivedAt,
  });
}

export async function updateOrder(id: string, data: Pizza) {
  const order = await ordersCollection.findOne({ _id: id });
  const duration = (data.servedAt! - order?.receivedAt!) / 1000;
  await ordersCollection.updateOne(
    { _id: id },
    { $push: { pizzas: data }, $set: { finishedAt: data.servedAt, duration } }
  );
}
