'use client'
import { useParams } from 'next/navigation'
import { usePokemon } from '@/hooks/usePokemon'
import Head from 'next/head'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CheckIcon } from '@radix-ui/react-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function PokemonDetail () {
  const { data: session, status } = useSession()
  const { pokemonName } = useParams() || ''
  let nameValue: string = pokemonName as string
  const { pokemon, pokemonLoading } = usePokemon(nameValue)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showAlert, setShowAlert] = useState('')
  const [alert, setAlert] = useState(false)

  const updatePet = async () => {
    setSubmitting(true)

    try {
      const res = await fetch(`/api/save`, {
        method: 'PATCH',
        body: JSON.stringify({
          email: session?.user?.email,
          pet: pokemon?.name.toLowerCase()
        })
      })

      if (res.ok) {
        // redirect('/')
        setAlert(true)
        setShowAlert('saved') // Set state to display the alert
        setTimeout(() => setAlert(false), 3000)
      }
    } catch (error) {
    } finally {
      setSubmitting(false)
    }
  }

  const deletePet = async () => {
    setDeleting(true)

    try {
      const res = await fetch(`/api/save`, {
        method: 'DELETE',
        body: JSON.stringify({
          email: session?.user?.email,
          pet: pokemon?.name.toLowerCase()
        })
      })

      if (res.ok) {
        // console.log('Pet deleted successfully!')
        setAlert(true)
        setShowAlert('deleted') // Set state to display the alert
        setTimeout(() => setAlert(false), 3000)
      } else {
        console.error('Error deleting pet:', res.statusText)
      }
    } catch (error) {
      console.error('Error deleting pet:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Head>{pokemon && <title>{`${pokemon?.name}`}</title>}</Head>
      <Card>
        <Button className='m-2' onClick={() => window.history.back()}>
          Back
        </Button>
        <Button className='m-2' onClick={updatePet}>
          {submitting ? 'Saving...' : 'Save as Pet'}
        </Button>
        <Button className='m-2' variant='destructive' onClick={deletePet}>
          {deleting ? 'Deleting...' : 'Delete as Pet'}
        </Button>
      </Card>
      {alert && (
        <div className='flex justify-end'>
          <Alert className='w-1/4 absolute transition-opacity  animate-bounce'>
            <CheckIcon className='h-4 w-4' />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              {showAlert === 'saved'
                ? 'Pet saved successfully!'
                : showAlert === 'deleted'
                ? 'Pet deleted successfully!'
                : ''}
            </AlertDescription>
          </Alert>
        </div>
      )}
      <Card className='flex flex-col items-center'>
        {pokemonLoading && <div>Loading...</div>}
        {pokemon === null && <div>Not found</div>}
        {pokemon && (
          <>
            <h1 className='text-xl font-bold'>{pokemon.name.toUpperCase()}</h1>
            <Image
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={'Pokemon: ' + pokemon.name}
              width={400}
              height={400}
            />
            <CardContent className=''>
              <div>
                <strong>Types:</strong>
                {pokemon.types.map(type => type.type.name).join(', ')}
              </div>
              <div>
                <strong>Height:</strong> {pokemon.height * 10} cm
              </div>
              <div>
                <strong>Weight:</strong> {pokemon.weight / 10} kg
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </>
  )
}
