import connect from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import { Friend } from '../route'
import connectToRabbitMQ from '@/lib/rabbitmq'

export const PATCH = async (req: any) => {
  const { email, friendEmail } = await req.json()

  try {
    await connect()

    const existingUser = await User.findOne({ email: email })
    if (!existingUser) return new Response('User not found', { status: 404 })

    // Check if the friendEmail already exists in the friends array
    const existingFriend = existingUser.friends.find(
      (friend: Friend) => friend.email === friendEmail
    )

    if (!existingFriend) {
      // Add new friend with email and distance
      existingUser.friends.push({
        email: friendEmail,
        distance: 0
      })
      // Notify the friend about being added
      //   const channel = await connectToRabbitMQ()
      //   channel.sendToQueue(
      //     'friendAddedQueue',
      //     Buffer.from(
      //       JSON.stringify({
      //         type: 'FRIEND_ADDED_NOTIFICATION',
      //         userEmail: email,
      //         friendEmail: friendEmail
      //       })
      //     )
      //   )
    } else {
      // Update distance if the friend already exists
      existingFriend.distance = 1
    }

    await existingUser.save()
    return new NextResponse(JSON.stringify(existingUser), { status: 200 })
  } catch (error) {
    return new NextResponse('Error update', { status: 500 })
  }
}
