import amqp from 'amqplib'

export type RabbitT = {
  connection: amqp.Connection
  channel: amqp.Channel
}

const connectRabbitMQ = async (): Promise<RabbitT> => {
  try {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    console.log(connection)
    console.log(channel)

    return { connection, channel }
  } catch (error) {
    console.error('Error establishing RabbitMQ connection:', error)
    throw error
  }
}
export default connectRabbitMQ
