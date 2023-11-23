'use client'
import { use, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UserT, UserTArray } from '@/models/UserT'

const Mensen = () => {
  const [button, setButton] = useState(false)
  const [location, setLocation] = useState<{
    latitude?: number
    longitude?: number
  }>()
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()
  const [address, setAddress] = useState('')
  const [user, setUser] = useState<UserT | null>(null)
  const [user2, setUser2] = useState<UserTArray | null>(null)
  const [nearbyUsers, setNearbyUsers] = useState<UserTArray | null>(null)

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

  useEffect(() => {
    if ('geolocation' in navigator) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords
        setTimeout(() => {
          setLocation({ latitude, longitude })
          setLoading(false)
        }, 1000)
      })
    }
  }, [button])

  const updateLocation = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/lokasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: session?.user?.email,
          latitude: location?.latitude,
          longitude: location?.longitude,
          address: address
        })
      })

      if (res.status === 200) {
        console.log('Location updated successfully')
      } else {
        console.error('Failed to update location')
      }
    } catch (error) {
      console.error('Error updating location', error)
    } finally {
      setLoading(false)
    }
  }

  const API_KEY = 'cb161165a80f4f148808ac431e8eb7df'
  const latitude = user?.latitude
  const longitude = user?.longitude

  function getLocationInfo () {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${API_KEY}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status.code === 200) {
          setAddress(data.results[0].formatted)
        } else {
          console.log('Reverse geolocation request failed.')
        }
      })
      .catch(error => console.error(error))
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
          user.latitude !== undefined &&
          user.longitude !== undefined
        ) {
          const distance = calculateDistance(
            user.latitude,
            user.longitude,
            otherUser.latitude,
            otherUser.longitude
          )

          if (distance <= 10) {
            acc.push(otherUser)
          }
        }
        return acc
      }, [] as UserT[])

      setNearbyUsers(nearbyUsers)
    }
  }

  //   const findNearby = () => {
  //     if (user?.latitude && user?.longitude && user2) {
  //       const nearbyUsers = []
  //       // Loop through all users (or retrieve users from an API)
  //       for (const otherUser of user2) {
  //         if (otherUser.email !== session?.user?.email) {
  //           const distance = calculateDistance(
  //             user.latitude,
  //             user.longitude,
  //             otherUser.latitude,
  //             otherUser.longitude
  //           )

  //           if (distance <= 10) {
  //             nearbyUsers.push(otherUser)
  //           }
  //         }
  //       }

  //       setNearbyUsers(nearbyUsers)
  //     }
  //   }

  return (
    <>
      <Card>
        <CardHeader className='w-3/12 mx-auto'>
          <Button onClick={() => setButton(!button)}>Kalibrasi Lokasi</Button>
          <Button onClick={updateLocation}>Save Lokasi</Button>
          <Button onClick={getLocationInfo}>Get Lokasi</Button>
          <Button onClick={findNearby}>Get User</Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : location ? (
            <div>
              <h2>Your Location: {address}</h2>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='w-3/12 mx-auto'>
          <p>Nearby User</p>
        </CardHeader>
        <CardContent>
          {!nearbyUsers ? (
            <p>Tidak ada orang di dekat anda</p>
          ) : (
            <div>
              {nearbyUsers.map((user, index) => (
                <div key={index}>
                  <p>{user.email}</p>
                  <p>{user.latitude}</p>
                  <p>{user.longitude}</p>
                  <p>{user.address}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default Mensen
