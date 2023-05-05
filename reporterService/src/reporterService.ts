import { Pizza } from "./models";
import { connectRabbitMQ, consumeFromQueue } from "./util/rabbitmq";
import { initializeDatabase, insertOrder } from "./database";

async function reporterService() {
  try {
    const connection = await connectRabbitMQ();
    await initializeDatabase();

    await consumeFromQueue(
      connection,
      "reporterQueue",
      async (pizza: Pizza) => {
        if (pizza.receivedAt && pizza.servedAt) {
          const preparationTime = pizza.servedAt - pizza.receivedAt;
          console.log(
            `Pizza with ID : ${pizza.id} was prepared in ${
              preparationTime / 1000
            } seconds.`
          );

          // await insertOrder(pizza.id, pizza.receivedAt, pizza.servedAt);
        }
      }
    );
  } catch (err) {
    console.error("Reporter Service error", err);
  }
}

reporterService();
