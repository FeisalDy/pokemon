import { usePokemon } from '@/hooks/usePokemon'
import Link from 'next/link'
import Image from 'next/image'

export default function PokemonEntry ({ name }: { name: string }) {
  const { pokemon, pokemonLoading } = usePokemon(name)

  return (
    <Link href={'/' + name}>
      <div className='flex flex-col items-center justify-center min-w-[210px] min-h-[260px]'>
        {pokemonLoading && <div>Loading...</div>}
        {pokemon && (
          <div className='flex flex-col items-center rounded-md bg-slate-500 backdrop-blur'>
            <h1 className='text-center text-capitalize'>{pokemon.name}</h1>
            {pokemon.sprites &&
              pokemon.sprites.other &&
              pokemon.sprites.other['official-artwork'] &&
              pokemon.sprites.other['official-artwork'].front_default && (
                <Image
                  src={pokemon.sprites.other['official-artwork'].front_default}
                  alt={'Pokemon: ' + pokemon.name}
                  width={200}
                  height={200}
                />
              )}
          </div>
        )}
      </div>
    </Link>
  )
}
