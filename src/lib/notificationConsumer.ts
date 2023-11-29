import amqp from 'amqplib'
import User from '@/models/User'

export const saveMessageToUser = async (notificationData: any) => {
  try {
    const { email, friendEmail, notificationType } = notificationData

    if (notificationType === 'friendConfirmation') {
      const existingUser = await User.findOne({ email: friendEmail })

      if (existingUser) {
        existingUser.notifications.push({
          message: `${email} sent you a friend request!`,
          status: 'unread'
        })

        await existingUser.save()
        console.log(`Message saved for user with email: ${friendEmail}`)
      } else {
        console.log('User not found.')
      }
    }
  } catch (error) {
    console.error('Error saving message to user:', error)
  }
}

export const startMessageConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    const queue = 'friendConfirmationQueue'
    await channel.assertQueue(queue, { durable: true })

    channel.consume(queue, msg => {
      if (msg !== null) {
        const notificationData = JSON.parse(msg.content.toString())
        console.log('Received notification data:', notificationData)

        saveMessageToUser(notificationData)

        channel.ack(msg)
      }
    })
  } catch (error) {
    console.error('Error in the message consumer:', error)
  }
}
