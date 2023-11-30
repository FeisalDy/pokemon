import connectRabbitMQ from '@/lib/rabbitmq'
import sendToQueue from '@/lib/message'
import connect from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import { Friend } from '../route'
import { startMessageConsumer } from '@/lib/notificationConsumer'

export const PATCH = async (req: any) => {
  const { email, friendEmail } = await req.json()

  try {
    await connect()
    const { connection, channel } = await connectRabbitMQ()

    const queue = 'friendConfirmationQueue'
    const notificationData = {
      email,
      friendEmail,
      notificationType: 'friendConfirmation'
    }

    await sendToQueue(channel, queue, notificationData)

    const existingUser = await User.findOne({ email: email })
    if (!existingUser) return new Response('User not found', { status: 404 })

    const existingFriend = await User.findOne({ email: friendEmail })
    if (!existingFriend)
      return new Response('Friend not found', { status: 404 })

    // const existingFriend = existingUser.friends.find(
    //   (friend: Friend) => friend.email === friendEmail
    // )
    const userFriend = existingUser.friends.find(
      (friend: Friend) => friend.email === friendEmail
    )
    if (!userFriend) {
      existingUser.friends.push({
        email: friendEmail,
        distance: 0
      })
    } else {
      userFriend.distance = 1
    }

    // if (!existingFriend) {
    //   existingUser.friends.push({
    //     email: friendEmail,
    //     distance: 0
    //   })
    // } else {
    //   existingFriend.distance = 1
    // }

    const friendFriend = existingFriend.friends.find(
      (friend: Friend) => friend.email === email
    )
    if (!friendFriend) {
      existingFriend.friends.push({
        email: email,
        distance: 0
      })
    } else {
      friendFriend.distance = 1
    }

    await existingUser.save()
    await existingFriend.save()
    await channel.close()
    await connection.close()

    startMessageConsumer()

    return new NextResponse(JSON.stringify(existingUser), { status: 200 })
  } catch (error) {
    console.error('Error in PATCH:', error)
    return new NextResponse('Error update', { status: 500 })
  }
}
