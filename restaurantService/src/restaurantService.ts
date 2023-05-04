import { Pizza } from './models';
import { connectRabbitMQ, sendToQueue, consumeFromQueue } from './util/rabbitmq';

const orders: Pizza[] = [
    new Pizza(['pepperoni', 'mushrooms']),
    new Pizza(['ham', 'pineapple']),
    new Pizza(['sausage', 'onions', 'green peppers']),
];

(async () => {
    try {
        const connection = await connectRabbitMQ();
        for (const order of orders) {
            await sendToQueue(connection, 'doughQueue', order);
        }
    } catch (err) {
        console.log('eer', err)
    }
})();