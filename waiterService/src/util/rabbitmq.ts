import * as amqp from "amqplib";

export async function connectRabbitMQ(
  attempts: number = 10,
  delayMs: number = 2000
): Promise<amqp.Connection> {
  for (let i = 0; i < attempts; i++) {
    try {
      const connectionString = "amqp://rabbitmq:5672";
      return await amqp.connect(connectionString);
    } catch (error) {
      console.log(
        `Failed to connect to RabbitMQ. Retrying in ${delayMs} ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error(`Failed to connect to RabbitMQ after ${attempts}.`);
}

export async function sendToQueue(
  connection: amqp.Connection,
  queueName: string,
  data: any
): Promise<void> {
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  console.log(`Sent to ${queueName}`);
}

export async function consumeFromQueue(
  connection: amqp.Connection,
  queueName: string,
  callback: (data: any) => Promise<void>
): Promise<void> {
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName);
  channel.consume(queueName, async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      await callback(data);
      channel.ack(msg);
    }
  });
}
