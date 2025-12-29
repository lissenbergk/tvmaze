import { type ShowWithScore, type Show } from '@/types/types'

export async function getShows(page: number): Promise<Show[]> {
  const url = import.meta.env.VITE_TVMAZE_BASE_URL + `shows?page=${page}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('API error: getShows(), response was not OK')
    }

    return (await response.json()) as Show[]
  } catch (error) {
    throw error
  }
}

export async function searchShows(query: string): Promise<ShowWithScore[]> {
  const url = import.meta.env.VITE_TVMAZE_BASE_URL + `search/shows?q=${query}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('API error: searchShows(), response was not OK')
    }

    return (await response.json()) as ShowWithScore[]
  } catch (error) {
    throw error
  }
}
