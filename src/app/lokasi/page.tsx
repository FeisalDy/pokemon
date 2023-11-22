'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

const Mensen = () => {
  const [button, setButton] = useState(false)
  const [location, setLocation] = useState()
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    if ('geolocation' in navigator) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords
        setTimeout(() => {
          setLocation({ latitude, longitude })
          setLoading(false)
        }, 3000) // Delay of 3 seconds (3000 milliseconds)
      })
    }
  }, [button])

  console.log(session?.user?.email)

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
          longitude: location?.longitude
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

  console.log(location)
  return (
    <div>
      <Button onClick={() => setButton(!button)}>Kalibrasi Lokasi</Button>
      <Button onClick={updateLocation}>Save Lokasi</Button>

      {loading ? (
        <p>Loading...</p>
      ) : location ? (
        <div>
          <h2>Your Location</h2>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      ) : null}
    </div>
  )
}

export default Mensen
