import { Pizza } from "./models";
import {
  connectRabbitMQ,
  sendToQueue,
  consumeFromQueue,
} from "./util/rabbitmq";
import { logWithTime } from "./util/logging";

async function toppingChefService() {
  try {
    const connection = await connectRabbitMQ();

    await consumeFromQueue(connection, "toppingQueue", async (pizza: Pizza) => {
      logWithTime(`--Pizza with ID :${pizza.id} Topping started`);
      for (const topping of pizza.toppings) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }
      pizza.toppingsReady = true;
      logWithTime(`--Pizza with ID :${pizza.id} Topping finished`);
      await sendToQueue(connection, "ovenQueue", pizza);
    });
  } catch (err) {
    console.error("Topping Service error", err);
  }
}

toppingChefService();
