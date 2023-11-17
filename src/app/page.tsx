'use client'
import { useSearchParams } from 'next/navigation'
import PokemonEntry from '@/components/PokemonEntry'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { usePokemons } from '@/hooks/usePokemon'
import { Card } from '@/components/ui/card'

export default function Home () {
  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get('page') ?? '1')
  const router = useRouter()

  const { pokemons, pokemonsLoading } = usePokemons(page)

  return (
    <Card className=''>
      <div className='grid grid-rows-3 grid-flow-col'>
        {pokemons?.results.map(pokemonEntry => (
          <div key={pokemonEntry.name}>
            <PokemonEntry name={pokemonEntry.name} />
          </div>
        ))}
      </div>
      <div className='flex gap-2 justify-between m-2'>
        <Button
          onClick={() => {
            if (pokemons?.previous) {
              router.push(`?page=${page - 1}`)
            }
          }}
          disabled={!pokemons?.previous}
        >
          Previous page
        </Button>
        <Button
          onClick={() => {
            if (pokemons?.next) {
              router.push(`?page=${page + 1}`)
            }
          }}
          disabled={!pokemons?.next}
        >
          Next page
        </Button>
      </div>
    </Card>
  )
}
