import { Pizza } from "./models";
import {
  connectRabbitMQ,
  sendToQueue,
  consumeFromQueue,
} from "./util/rabbitmq";

async function toppingChefService() {
  try {
    const connection = await connectRabbitMQ();

    await consumeFromQueue(connection, "toppingQueue", async (pizza: Pizza) => {
      console.log(`Pizza with ID :${pizza.id} Topping started`);
      for (const topping of pizza.toppings) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }
      pizza.toppingsReady = true;
      console.log(`Pizza with ID :${pizza.id} Topping finished`);
      await sendToQueue(connection, "ovenQueue", pizza);
    });
  } catch (err) {
    console.log("Topping Service error", err);
  }
}

toppingChefService();
