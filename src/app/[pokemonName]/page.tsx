'use client'
import { useParams } from 'next/navigation'
import { usePokemon } from '@/hooks/usePokemon'
import Head from 'next/head'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PokemonDetail () {
  const { pokemonName } = useParams() || ''
  let nameValue: string = pokemonName as string
  const { pokemon, pokemonLoading } = usePokemon(nameValue)

  return (
    <>
      <Head>{pokemon && <title>{`${pokemon?.name}`}</title>}</Head>
      <Button className='m-2' onClick={() => window.history.back()}>
        Back
      </Button>
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
                <strong>Types:</strong>{' '}
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
