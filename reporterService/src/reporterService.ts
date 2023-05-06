import { Pizza } from "./models";
import { connectRabbitMQ, consumeFromQueue } from "./util/rabbitmq";
import {
  initializeDatabase,
  findOrder,
  updateOrder,
  insertOrder,
} from "./database";

async function reporterService() {
  try {
    const connection = await connectRabbitMQ();
    await initializeDatabase();

    await consumeFromQueue(
      connection,
      "reporterInitQueue",
      async ({ groupId, receivedAt }) => {
        await insertOrder(groupId, receivedAt);
      }
    );

    await consumeFromQueue(
      connection,
      "reporterQueue",
      async (pizza: Pizza) => {
        if (pizza.receivedAt && pizza.servedAt) {
          const preparationTime = pizza.servedAt - pizza.receivedAt;
          pizza.duration = preparationTime / 1000;
          console.log(
            `Pizza with ID : ${pizza.id} was prepared in ${
              preparationTime / 1000
            } seconds.`
          );

          await updateOrder(pizza.groupId, pizza);
        }
      }
    );
  } catch (err) {
    console.error("Reporter Service error", err);
  }
}

reporterService();
