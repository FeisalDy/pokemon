import amqp from 'amqplib'

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    return channel
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error)
    throw error
  }
}

export default connectToRabbitMQ
