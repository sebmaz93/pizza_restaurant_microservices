import { Pizza } from "./models";
import {
  connectRabbitMQ,
  sendToQueue,
  consumeFromQueue,
} from "./util/rabbitmq";

async function doughChefService() {
  try {
    const connection = await connectRabbitMQ();

    await consumeFromQueue(connection, "doughQueue", async (pizza: Pizza) => {
      console.log(`Pizza with ID :${pizza.id} Dough started`);
      await new Promise((resolve) => setTimeout(resolve, 7000));
      pizza.doughReady = true;
      console.log(`Pizza with ID :${pizza.id} Dough finished`);
      await sendToQueue(connection, "toppingQueue", pizza);
    });
  } catch (err) {
    console.log("Dough service error", err);
  }
}

doughChefService();
