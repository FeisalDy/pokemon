import User from '@/models/User'
import connect from '@/lib/db'
import { NextResponse } from 'next/server'

export const PATCH = async (req: any) => {
  const { email, notificationId } = await req.json()

  try {
    await connect()

    const existingUser = await User.findOne({ email: email })
    if (!existingUser) return new Response('User not found', { status: 404 })

    const notification = existingUser.notifications.find(
      (notification: { _id: string }) =>
        notification._id.toString() === notificationId
    )
    if (!notification)
      return new Response('Notification not found', { status: 404 })

    notification.status = 'read'

    await existingUser.save()
    return new NextResponse(JSON.stringify(existingUser.notifications), {
      status: 200
    })
  } catch (error) {
    return new NextResponse('Error update', { status: 500 })
  }
}
