'use client'
import { useSearchParams } from 'next/navigation'
import PokemonEntry from '@/components/PokemonEntry'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { usePokemon, usePokemons, usePokemonsByType } from '@/hooks/usePokemon'
import { Card } from '@/components/ui/card'
import useUpdateQueryString from '@/hooks/useUpdateQueryString'
import { Fillter } from '@/components/Fillter'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Home () {
  const updateQueryString = useUpdateQueryString()
  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get('page') ?? '1')
  const name = searchParams.get('name') ?? ''
  const fillter = searchParams.get('fillter') ?? ''
  const { data: session, status } = useSession()
  const [user, setUser] = useState([])
  console.log(user?.pets)
  useEffect(() => {
    // fetch data
    const fetchPosts = async () => {
      const res = await fetch(`/api/save/${session?.user?.email}`)
      const data = await res.json()

      setUser(data)
    }

    if (session?.user?.email) fetchPosts()
  }, [session?.user?.email])

  const handlePageNavigation = (direction: string) => {
    if (direction === 'next' && pokemons?.next) {
      const nextPage = page + 1
      updateQueryString({ page: nextPage.toString() })
    } else if (direction === 'previous' && pokemons?.previous) {
      const previousPage = page - 1
      updateQueryString({ page: previousPage.toString() })
    }
  }

  const pageSize = 12
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  const { pokemons, pokemonsLoading } = usePokemons(page)
  const { pokemon, pokemonLoading } = usePokemon(name)
  const { pokemonsByType, pokemonsByTypeLoading } = usePokemonsByType(fillter)
  console.log(pokemonsByType)

  return (
    <Card className='mx-auto'>
      <Fillter />

      {fillter && !name && (
        <div className='grid grid-cols-4 gap-4'>
          {pokemonsByType &&
            pokemonsByType?.pokemon
              ?.slice(startIndex, endIndex)
              .map((pokemon, index) => (
                <div
                  key={pokemon?.pokemon?.name}
                  style={{
                    background: user?.pets?.includes(pokemon.pokemon.name)
                      ? 'goldenrod'
                      : 'transparent'
                  }}
                >
                  <PokemonEntry name={pokemon?.pokemon?.name} />
                </div>
              ))}
        </div>
      )}

      {name ? (
        pokemon ? (
          <div
            key={pokemon.name}
            style={{
              background: user?.pets?.includes(pokemon.name)
                ? 'goldenrod'
                : 'transparent'
            }}
          >
            <PokemonEntry name={pokemon.name} />
          </div>
        ) : (
          <div>Not found</div>
        )
      ) : null}

      {!fillter && !name && (
        <div className='grid grid-cols-4 gap-4'>
          {pokemons?.results.map(pokemonEntry => (
            <div
              key={pokemonEntry.name}
              style={{
                background: user?.pets?.includes(pokemonEntry.name)
                  ? 'goldenrod'
                  : 'transparent'
              }}
            >
              <PokemonEntry name={pokemonEntry.name} />
            </div>
          ))}
        </div>
      )}

      <div className='flex gap-2 justify-between m-2'>
        <Button
          onClick={() => handlePageNavigation('previous')}
          disabled={!pokemons?.previous}
        >
          Previous page
        </Button>
        <Button
          onClick={() => handlePageNavigation('next')}
          disabled={!pokemons?.next || name !== ''}
        >
          Next page
        </Button>
      </div>
    </Card>
  )
}
