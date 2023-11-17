export type PokemonPage = {
  results: { name: string }[]
  next: string | null
  previous: string | null
}

export type Pokemon = {
  name: string
  types: {
    type: {
      name: string
    }
  }[]
  weight: number
  height: number
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
}
