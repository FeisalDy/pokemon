import amqp from 'amqplib'

const sendToQueue = async (
  channel: amqp.Channel,
  queue: string,
  data: any
): Promise<void> => {
  try {
    await channel.assertQueue(queue, { durable: true })

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
  } catch (error) {
    console.error('Error sending message to queue:', error)
    throw error
  }
}

export default sendToQueue
