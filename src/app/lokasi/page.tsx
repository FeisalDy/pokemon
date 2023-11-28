'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UserT } from '@/models/UserT'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Payment, columns } from './columns'
import { DataTable } from './data-table'

type LocationData = {
  latitude: number
  longitude: number
  address: string
}

const Mensen = () => {
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()
  const [user, setUser] = useState<UserT | null>(null)
  const [user2, setUser2] = useState<UserT[]>([])
  const [nearbyUsers, setNearbyUsers] = useState<UserT[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [showAlertErr, setShowAlertErr] = useState(false)
  const [tableData, setTableData] = useState<Payment[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/save/${session?.user?.email}`)
      const res2 = await fetch('/api/getUser')
      const data = await res.json()
      const data2 = await res2.json()

      setUser(data)
      setUser2(data2)
    }

    if (session?.user?.email) fetchPosts()
  }, [session?.user?.email])

  const API_KEY = 'cb161165a80f4f148808ac431e8eb7df'

  const getLocation = async () => {
    setLoading(true)

    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude, longitude } = coords

          const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${API_KEY}`
          fetch(url)
            .then(response => response.json())
            .then(data => {
              if (data.status.code === 200) {
                // setAddress(data.results[0].formatted)

                saveLocationToDB({
                  latitude,
                  longitude,
                  address: data.results[0].formatted
                })
              } else {
                setShowAlertErr(true)
                setTimeout(() => setShowAlertErr(false), 3000)
              }
            })
            .catch(error =>
              console.log('An error occured when fetching location', error)
            )
        })
      }
    } catch (error) {
      setShowAlertErr(true)
      setTimeout(() => setShowAlertErr(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  const saveLocationToDB = async ({
    latitude,
    longitude,
    address
  }: LocationData) => {
    try {
      const res = await fetch('/api/lokasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: session?.user?.email,
          latitude,
          longitude,
          address
        })
      })

      if (res.status === 200) {
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      } else {
        setShowAlertErr(true)
        setTimeout(() => setShowAlertErr(false), 3000)
      }
    } catch (error) {
      setShowAlertErr(true)
      setTimeout(() => setShowAlertErr(false), 3000)
    }
  }

  function calculateDistance (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371 // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return distance
  }

  const findNearby = () => {
    if (user?.latitude && user?.longitude && user2) {
      const nearbyUsers = user2.reduce((acc, otherUser) => {
        if (
          otherUser.email !== session?.user?.email &&
          otherUser.latitude !== undefined &&
          otherUser.longitude !== undefined &&
          otherUser.latitude !== null &&
          otherUser.longitude !== null &&
          user.latitude !== undefined &&
          user.longitude !== undefined &&
          user.latitude !== null &&
          user.longitude !== null
        ) {
          const distance = calculateDistance(
            user.latitude,
            user.longitude,
            otherUser.latitude,
            otherUser.longitude
          )

          let status = 'not friend'
          const isFriend = user.friends?.find(
            friend => friend.email === otherUser.email
          )

          if (isFriend) {
            status = 'is friend'
          }

          if (distance <= 10) {
            acc.push({ ...otherUser, distance, status })
          }
        }
        return acc
        //   }, [] as UserT[])
      }, [] as (UserT & { distance: number; status: string })[])

      setNearbyUsers(nearbyUsers)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className='w-3/12 mx-auto'></CardHeader>

        <CardContent>
          {showAlert && (
            <div className='flex justify-end'>
              <Alert className='w-1/4 absolute transition-opacity animate-bounce'>
                <CheckIcon className='h-4 w-4' />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Location saved successfully!
                </AlertDescription>
              </Alert>
            </div>
          )}
          {showAlertErr && (
            <div className='flex justify-end'>
              <Alert
                variant='destructive'
                className='w-1/4 absolute transition-opacity animate-bounce bg-background'
              >
                <ExclamationTriangleIcon className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again later.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <div className='flex justify-evenly gap-2'>
            <Button className='w-full' onClick={getLocation}>
              Update Lokasi
            </Button>
            <Button className='w-full' onClick={findNearby}>
              User Terdekat
            </Button>
          </div>
          <div className='my-10'>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <h2>Your Location: {user?.address}</h2>
                <p>Latitude: {user?.latitude}</p>
                <p>Longitude: {user?.longitude}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className=''>
          <p className='text-center'>Nearby User</p>
        </CardHeader>
        <CardContent>
          {/* {!nearbyUsers ? (
            <p>Tidak ada orang di dekat anda</p>
          ) : (
            <div className='flex justify-evenly'>
              {nearbyUsers.map((user, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger>
                    <Card className='flex gap-1 items-center p-2'>
                      <Avatar>
                        <AvatarImage src='https://github.com/shadcn.png' />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <p className=''> {user.email}</p>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className='w-6/12'>
                    <p>{user.email}</p>
                    <p className='text-justify'>
                      User Address : {user.address}
                    </p>
                    <p>
                      Distance: {user.distance ? user.distance.toFixed(2) : ''}
                      Km
                    </p>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          )} */}
          <div className='container mx-auto pb-10'>
            <DataTable columns={columns} data={nearbyUsers} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default Mensen
