import { Pizza } from "./models";
import {
  connectRabbitMQ,
  sendToQueue,
  consumeFromQueue,
} from "./util/rabbitmq";
import { logWithTime } from "./util/logging";

async function doughChefService() {
  try {
    const connection = await connectRabbitMQ();

    await consumeFromQueue(connection, "doughQueue", async (pizza: Pizza) => {
      logWithTime(`--Pizza with ID :${pizza.id} Dough started`);
      await new Promise((resolve) => setTimeout(resolve, 7000));
      pizza.doughReady = true;
      logWithTime(`--Pizza with ID :${pizza.id} Dough finished`);
      await sendToQueue(connection, "toppingQueue", pizza);
    });
  } catch (err) {
    console.error("Dough service error", err);
  }
}

doughChefService();
