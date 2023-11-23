import User from '@/models/User'
import connect from '@/lib/db'

export const GET = async (req: any) => {
  try {
    await connect()

    const users = await User.find({})
    if (!users || users.length === 0)
      return new Response('No users found', { status: 404 })

    return new Response(JSON.stringify(users), { status: 200 })
  } catch (error) {
    return new Response('Error getting users', { status: 500 })
  }
}
