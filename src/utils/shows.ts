import type { Show } from '@/types/types'

export function groupShowsByGenre(shows: Show[], sortingOrder: 'asc' | 'desc' = 'desc') {
  const genreBasedShows: Record<string, Show[]> = {}

  for (const show of shows) {
    for (const genre of show.genres) {
      if (!genreBasedShows[genre]) {
        genreBasedShows[genre] = []
      }
      genreBasedShows[genre].push(show)
    }
  }

  for (const genre of Object.keys(genreBasedShows)) {
    if (genreBasedShows[genre]) {
      genreBasedShows[genre] = genreBasedShows[genre].sort((a: Show, b: Show) => {
        const ratingA = a.rating?.average ?? 0
        const ratingB = b.rating?.average ?? 0
        return sortingOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA
      })
    }
  }

  return genreBasedShows
}
