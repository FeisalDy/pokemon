'use client'
import { usePokemon } from '@/hooks/usePokemon'
import Link from 'next/link'
import Image from 'next/image'
import { ColorExtractor } from 'react-color-extractor'
import React, { useState } from 'react'

type Color = string

export default function PokemonEntry ({ name }: { name: string }) {
  const { pokemon, pokemonLoading } = usePokemon(name)
  const [dominantColor, setDominantColor] = useState<string>('')

  const getDominantColor = (colors: Color[]) => {
    if (colors && colors.length > 0) {
      setDominantColor(colors[0])
    }
  }

  return (
    <Link href={'/' + name}>
      <div className='flex flex-col items-center justify-center min-w-[210px] min-h-[260px]'>
        {pokemonLoading && <div>Loading...</div>}
        {pokemon && (
          <div
            className='flex flex-col items-center rounded-md backdrop-blur'
            style={{
              backgroundColor: dominantColor
            }}
          >
            <h1 className='text-center text-capitalize'>{pokemon.name}</h1>
            {pokemon.sprites &&
              pokemon.sprites.other &&
              pokemon.sprites.other['official-artwork'] &&
              pokemon.sprites.other['official-artwork'].front_default && (
                <div>
                  <Image
                    src={
                      pokemon.sprites.other['official-artwork'].front_default
                    }
                    alt={'Pokemon: ' + pokemon.name}
                    width={200}
                    height={200}
                  />
                  <ColorExtractor getColors={getDominantColor}>
                    <img
                      src={
                        pokemon.sprites.other['official-artwork'].front_default
                      }
                      style={{ display: 'none' }}
                      alt='pokemon'
                    />
                  </ColorExtractor>
                </div>
              )}
          </div>
        )}
      </div>
    </Link>
  )
}
