import connect from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export const POST = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      await connect()

      const { email, friendEmail, distance } = await req.json()

      // Find the current user based on userEmail
      const currentUser = await User.findOne({ email })

      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Find the friend user based on friendEmail
      const friendUser = await User.findOne({ friendEmail })

      if (!friendUser) {
        return res.status(404).json({ message: 'Friend user not found' })
      }

      // Update the distance for the friend in the currentUser's friends array
      const updatedFriends = currentUser.friends.map(friend => {
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
