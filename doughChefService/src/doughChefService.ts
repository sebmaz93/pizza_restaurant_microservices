import { Pizza } from './models';
import { connectRabbitMQ, sendToQueue, consumeFromQueue } from './util/rabbitmq';

(async () => {
    try {
        const connection = await connectRabbitMQ();

        await consumeFromQueue(connection, 'doughQueue', async (pizza: Pizza) => {
            await new Promise(resolve => setTimeout(resolve, 7000));
            console.log(`Dough prepared for pizza with ${pizza.toppings}`);
            await sendToQueue(connection, 'toppingQueue', pizza);
        });
    } catch (err) {
        console.log('Dough service error', err)
    }
})();