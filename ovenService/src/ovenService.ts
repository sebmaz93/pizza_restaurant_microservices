import { Pizza } from "./models";
import {
  connectRabbitMQ,
  sendToQueue,
  consumeFromQueue,
} from "./util/rabbitmq";
import { logWithTime } from "./util/logging";

async function ovenService() {
  try {
    const connection = await connectRabbitMQ();

    await consumeFromQueue(connection, "ovenQueue", async (pizza: Pizza) => {
      logWithTime(`--Pizza with ID :${pizza.id} Cooking started`);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      pizza.cooked = true;
      logWithTime(`--Pizza with ID :${pizza.id} Cooking finished`);
      await sendToQueue(connection, "waiterQueue", pizza);
    });
  } catch (err) {
    console.error("Oven Service error", err);
  }
}

ovenService();
