import { type Show } from './types'

export async function getShows(page: number): Promise<Show[]> {
  const url = import.meta.env.VITE_TVMAZE_BASE_URL + `shows?page=${page}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API error: getShows() returned status ${response.status}`)
    }

    return (await response.json()) as Show[]
  } catch (error) {
    throw error
  }
}
