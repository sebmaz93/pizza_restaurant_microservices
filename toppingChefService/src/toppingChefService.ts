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

      // Process toppings two at a time
      for (let i = 0; i < pizza.toppings.length; i += 2) {
        const toppingsChunk = pizza.toppings.slice(i, i + 2);

        await Promise.all(toppingsChunk.map(() => handleTopping()));
      }

      pizza.toppingsReady = true;
      logWithTime(`--Pizza with ID :${pizza.id} Topping finished`);
      await sendToQueue(connection, "ovenQueue", pizza);
    });
  } catch (err) {
    console.error("Topping Service error", err);
  }
}

function handleTopping(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 4000);
  });
}

toppingChefService();
