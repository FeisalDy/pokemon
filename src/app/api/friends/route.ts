import connect from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export type Friend = {
  email: string
  distance?: number
}

export const POST = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      await connect()

      const { email, friendEmail, distance } = await req.json()

      const currentUser = await User.findOne({ email })

      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      const friendUser = await User.findOne({ friendEmail })

      if (!friendUser) {
        return res.status(404).json({ message: 'Friend user not found' })
      }

      const updatedFriends = currentUser.friends.map((friend: Friend) => {
        if (friend.email === friendEmail) {
          return { ...friend, distance }
        }
        return friend
      })

      currentUser.friends = updatedFriends

      await currentUser.save()

      return new NextResponse('Distance saved successfully', { status: 200 })
    } catch (error) {
      return new NextResponse('Error saving distance', { status: 205000 })
    }
  } else {
    return new NextResponse('Method not allowed', { status: 405 })
  }
}
