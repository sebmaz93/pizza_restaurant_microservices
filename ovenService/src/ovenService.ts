import { Pizza } from './models';
import { connectRabbitMQ, sendToQueue, consumeFromQueue } from './util/rabbitmq';

(async () => {
    try {

        const connection = await connectRabbitMQ();

        await consumeFromQueue(connection, 'ovenQueue', async (pizza: Pizza) => {
            await new Promise(resolve => setTimeout(resolve, 10000));
            console.log(`Pizza with ${pizza.toppings} cooked`);
            await sendToQueue(connection, 'waiterQueue', pizza);
        });
    } catch (err) {
        console.log('Oven Service error',err)
    }
})();