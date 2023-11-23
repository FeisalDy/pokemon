'use client'
import PokemonEntry from '@/components/PokemonEntry'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Profile () {
  const { data: session, status } = useSession()
  const [data, setData] = useState<{ pets: string[] }>({ pets: [] })
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/save/${session?.user?.email}`)
      const data = await res.json()

      setData(data)
    }

    if (session?.user?.email) fetchPosts()
  }, [session?.user?.email])

  return (
    <>
      <Card>
        <h1 className='font-bold text-center text-4xl'>Your Pets</h1>

        <Card className='grid grid-cols-3'>
          {data?.pets?.map(pet => (
            <div key={pet}>
              <PokemonEntry name={pet} />
            </div>
          ))}
        </Card>
      </Card>
    </>
  )
}
