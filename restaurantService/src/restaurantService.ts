import express from "express";
import bodyParser from "body-parser";
import { Connection } from "amqplib";
import { Pizza } from "./models";
import { connectRabbitMQ, sendToQueue } from "./util/rabbitmq";
import { generateId } from "./util/id";

const app = express();
app.use(bodyParser.json());

let connection: Connection;

app.post("/order", async (req, res) => {
  try {
    const orders: Pizza[] = req.body;
    const ordersGroupId = generateId();
    if (connection) {
      await sendToQueue(connection, "reporterInitQueue", {
        ordersGroupId,
        receivedAt: Date.now(),
      });

      for (const order of orders) {
        order.id = generateId();
        order.groupId = ordersGroupId;
        await sendToQueue(connection, "doughQueue", order);
      }
      res.status(200).send({
        message: `Order received, your order ID is : ${ordersGroupId}`,
      });
    } else {
      res.status(500).send({ error: "Service unavailable." });
    }
  } catch (err) {
    console.error(`Error processing order: ${err}`);
    res.status(500).send({ error: "Failed to process order." });
  }
});

async function restaurantService() {
  try {
    connection = await connectRabbitMQ();

    const port = process.env.PORT || 3005;
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (err) {
    console.error(`Failed to connect to RabbitMQ: ${err}`);
  }
}

restaurantService();
