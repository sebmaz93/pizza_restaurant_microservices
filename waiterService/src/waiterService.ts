import { Pizza } from "./models";
import {
  connectRabbitMQ,
  sendToQueue,
  consumeFromQueue,
} from "./util/rabbitmq";
import { logWithTime } from "./util/logging";

async function waiterService() {
  try {
    const connection = await connectRabbitMQ();

    await consumeFromQueue(connection, "waiterQueue", async (pizza: Pizza) => {
      logWithTime(`--Pizza with ID :${pizza.id} serving started`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      pizza.servedAt = Date.now();
      pizza.served = true;
      logWithTime(`--Pizza with ID :${pizza.id} serving finished`);
      await sendToQueue(connection, "reporterQueue", pizza);
    });
  } catch (err) {
    console.error("Waiter Service error", err);
  }
}

waiterService();
