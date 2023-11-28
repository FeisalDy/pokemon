import amqp from 'amqplib'

async function connectToRabbitMQ () {
  try {
    const connection = await amqp.connect('amqp://localhost') // Replace with your RabbitMQ server address
    const channel = await connection.createChannel()
    return channel
  } catch (error) {
    console.error('RabbitMQ Connection Error:', error)
    throw error
  }
}

async function listenForFriendAddedNotifications () {
  const channel = await connectToRabbitMQ()

  const queueName = 'friendAddedQueue' // Replace with the actual queue name
  await channel.assertQueue(queueName, { durable: true })

  console.log('Waiting for friend added notifications...')

  channel.consume(queueName, msg => {
    if (msg !== null) {
      try {
        const notification = JSON.parse(msg.content.toString())
        handleFriendAddedNotification(notification)
      } catch (error) {
        console.error('Error processing notification:', error)
      }

      channel.ack(msg)
    }
  })
}

function handleFriendAddedNotification (notification) {
  // Extract necessary details from the notification (userEmail, friendEmail)
  const { userEmail, friendEmail } = notification

  // Implement your notification logic here (e.g., sending an email, push notification, etc.)
  console.log(
    `Sending notification to ${friendEmail} about being added by ${userEmail}.`
  )
  // Example: Send an email to the friend notifying them about being added
  // Code for sending email goes here
}

listenForFriendAddedNotifications().catch(error => {
  console.error('Notification Service Error:', error)
  process.exit(1)
})
