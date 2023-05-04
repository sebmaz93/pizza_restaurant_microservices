import { Pizza } from './models';
import { connectRabbitMQ, sendToQueue, consumeFromQueue } from './util/rabbitmq';

(async () => {
    try {

        const connection = await connectRabbitMQ();

        await consumeFromQueue(connection, 'toppingQueue', async (pizza: Pizza) => {
            for (const topping of pizza.toppings) {
                await new Promise(resolve => setTimeout(resolve, 4000));
                console.log(`Topping ${topping} added to pizza`);
            }
            await sendToQueue(connection, 'ovenQueue', pizza);
        });
    } catch (err) {
        console.log('Topping Service error', err)
    }
})();