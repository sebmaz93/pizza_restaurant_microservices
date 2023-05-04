import { Pizza } from './models';
import { connectRabbitMQ, sendToQueue, consumeFromQueue } from './util/rabbitmq';

(async () => {
    try {

        const connection = await connectRabbitMQ();

        await consumeFromQueue(connection, 'waiterQueue', async (pizza: Pizza) => {
            await new Promise(resolve => setTimeout(resolve, 5000));
            console.log(`Pizza with ${pizza.toppings} served`);
        });
    }catch (err) {
        console.log('Waiter Service error',err)
    }
})();
