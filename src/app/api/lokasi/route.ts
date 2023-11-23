import connect from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export const POST = async (req: any) => {
  if (req.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 })
  }

  await connect()
  const { email, latitude, longitude, address } = await req.json()

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return new NextResponse('User Not Found', { status: 404 })
    }

    // Update the user's location
    user.latitude = latitude
    user.longitude = longitude
    user.address = address
    await user.save()

    return new NextResponse('Location updated successfully', { status: 200 })
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
