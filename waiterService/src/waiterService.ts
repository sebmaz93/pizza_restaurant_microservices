import { Pizza } from "./models";
import {
  connectRabbitMQ,
  sendToQueue,
  consumeFromQueue,
} from "./util/rabbitmq";

async function waiterService() {
  try {
    const connection = await connectRabbitMQ();

    await consumeFromQueue(connection, "waiterQueue", async (pizza: Pizza) => {
      console.log(`Pizza with ID :${pizza.id} serving started`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      pizza.servedAt = Date.now();
      pizza.served = true;
      console.log(`Pizza with ID :${pizza.id} serving finished`);
      await sendToQueue(connection, "reporterQueue", pizza);
    });
  } catch (err) {
    console.log("Waiter Service error", err);
  }
}

waiterService();
