import useSWR from 'swr'
import * as PokemonApi from '@/lib/pokemon'
import { AxiosError } from 'axios'

export function usePokemon (name: string) {
  const { data, isLoading } = useSWR(name, async () => {
    try {
      return await PokemonApi.getPokemon(name)
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      } else {
        throw error
      }
    }
  })

  return {
    pokemon: data,
    pokemonLoading: isLoading
  }
}

export function usePokemons (page: number) {
  const { data, isLoading } = useSWR(['getPokemonPage', page], async () => {
    try {
      return await PokemonApi.getPokemonPage(page)
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      } else {
        throw error
      }
    }
  })

  return {
    pokemons: data,
    pokemonsLoading: isLoading
  }
}

export function useTypeList () {
  const { data, isLoading } = useSWR('getTypeList', async () => {
    try {
      return await PokemonApi.getTypeList()
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      } else {
        throw error
      }
    }
  })
  return {
    typeList: data,
    typeListLoading: isLoading
  }
}

export function usePokemonsByType (type: string) {
  const { data, isLoading } = useSWR(['getPokemonByType', type], async () => {
    try {
      return await PokemonApi.getPokemonByType(type)
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      } else {
        throw error
      }
    }
  })
  return {
    pokemonsByType: data,
    pokemonsByTypeLoading: isLoading
  }
}
