'use client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useUser } from '@/hooks/useUser'
import { useSession } from 'next-auth/react'
import { AxiosUser } from '@/lib/axios'
import { Notification } from '@/models/User'
import { BellIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState } from 'react'

export default function Notification () {
  const { data: session, status } = useSession()
  const { user, userLoading } = useUser(session?.user?.email)
  const [unreadCount, setUnreadCount] = useState(0)

  const handleNotification = async (notificationId: string) => {
    try {
      const email = session?.user?.email
      const response = await AxiosUser.patch('/notification', {
        email: email,
        notificationId: notificationId
      })
      if (response.status === 200) {
        console.log('success')
      } else {
        console.error('Error:', response.status)
      }
    } catch (error) {
      console.error('Err:', error)
    }
  }

  useEffect(() => {
    const unreadNotificationsCount =
      user?.notifications?.filter(
        notification => notification.status === 'unread'
      ).length || 0
    setUnreadCount(unreadNotificationsCount)
  }, [user?.notifications, userLoading])

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <div>
            <BellIcon className='w-6 h-6 mx-2' />
            {unreadCount > 0 && (
              <span className='absolute top-0 right-0 inline-block bg-red-500 text-white rounded-full px-2 py-1 text-[0.6rem]'>
                {unreadCount}
              </span>
            )}
          </div>
        </SheetTrigger>
        <SheetContent className='overflow-y-auto'>
          <SheetHeader>
            <SheetTitle>Your Notifications</SheetTitle>
            {user?.notifications?.map((notification, index) => (
              <div key={index} className='hover:cursor-pointer'>
                <Sheet>
                  <SheetTrigger className='w-full h-full'>
                    <Card onClick={() => handleNotification(notification._id)}>
                      <CardHeader>
                        <CardTitle>{notification.message}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          <p>{notification.status}</p>
                          <p>
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{notification.message}</SheetTitle>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>
            ))}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  )
}
