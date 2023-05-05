import { Pizza } from "./models";
import {
  connectRabbitMQ,
  sendToQueue,
  consumeFromQueue,
} from "./util/rabbitmq";

async function ovenService() {
  try {
    const connection = await connectRabbitMQ();

    await consumeFromQueue(connection, "ovenQueue", async (pizza: Pizza) => {
      console.log(`Pizza with ID :${pizza.id} Cooking started`);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      pizza.cooked = true;
      console.log(`Pizza with ID :${pizza.id} Cooking finished`);
      await sendToQueue(connection, "waiterQueue", pizza);
    });
  } catch (err) {
    console.log("Oven Service error", err);
  }
}

ovenService();
