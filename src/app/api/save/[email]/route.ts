import User from '@/models/User'
import connect from '@/lib/db'

type Params = {
  email: string
}

export const GET = async (req: any, { params }: { params: Params }) => {
  try {
    await connect()

    const user = await User.findOne({ email: params.email })
    if (!user) return new Response('User not found', { status: 404 })

    return new Response(JSON.stringify(user), { status: 200 })
  } catch (error) {
    return new Response('Error getting prompt', { status: 500 })
  }
}
