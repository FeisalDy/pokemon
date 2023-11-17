import Axios from '@/lib/axios'
import { Pokemon, PokemonPage } from '@/models/Pokemon'

export async function getPokemon (name: string) {
  const res = await Axios.get<Pokemon>(`/pokemon/${name}`)
  return res.data
}

export async function getPokemonPage (page: number) {
  const pageSize = 12
  const res = await Axios.get<PokemonPage>(
    `/pokemon?limit=${pageSize}&offset=${pageSize * (page - 1)}`
  )
  return res.data
}
