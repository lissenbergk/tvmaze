import { getShows, searchShows } from '@/api/shows.api'
import { type Show, type ShowWithScore } from '@/types/types'
import { defineStore } from 'pinia'
import { useSettingsStore } from './settings.store'

export function clearExpiredCache() {
  const persistedData = localStorage.getItem('shows')

  if (persistedData) {
    const data = JSON.parse(persistedData)
    const cacheDate = data.cacheDate

    if (cacheDate) {
      const cacheAge = Date.now() - new Date(cacheDate).getTime()
      const maxAge = 24 * 3600 * 1000

      if (cacheAge > maxAge) {
        console.log('📺 Cache expired, clearing storage')
        localStorage.removeItem('shows')
      }
    }
  }
}

export const useShowsStore = defineStore('shows', {
  state: () => ({
    shows: [] as Show[],
    searchedShows: [] as Show[],
    lastFetchedPage: 0 as number,
    genreLoadedCounts: {} as Record<string, number>,
    cacheDate: undefined as Date | undefined,
  }),

  getters: {
    genreBasedShows() {
      const genreBasedShows: Record<string, Show[]> = {}
      const settingsStore = useSettingsStore()
      const sortingOrder = settingsStore.sortingOrder

      for (const show of this.showsBasedOnSource) {
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
    },

    showsBasedOnSource(state) {
      const settingsStore = useSettingsStore()
      const showsSource = settingsStore.source

      return showsSource === 'search' ? state.searchedShows : state.shows
    },
  },

  actions: {
    async getShows() {
      const showsFromAPI = await getShows(this.lastFetchedPage)

      this.shows.push(...showsFromAPI)
      this.incrementLastFetchedPage()
      this.setCacheDate()
    },

    async getShowsForGenre(genre: string, limit: number = 10) {
      const currentCount = this.genreLoadedCounts[genre] || 0
      const availableCount = this.genreBasedShows[genre]?.length || 0

      if (availableCount >= currentCount + limit) {
        this.genreLoadedCounts[genre] = currentCount + limit
        return
      }

      const neededCount = currentCount + limit - availableCount
      await this.getMoreShows(genre, neededCount)
      this.genreLoadedCounts[genre] = currentCount + limit
    },

    getVisibleShowsForGenre(genre: string): Show[] {
      const loadedCount = this.genreLoadedCounts[genre] || 10
      const allShowsForGenre = this.genreBasedShows[genre] || []
      return allShowsForGenre.slice(0, loadedCount)
    },

    async getMoreShows(genre: string, newEntries: number) {
      const initialCount = this.genreBasedShows[genre] ? this.genreBasedShows[genre].length : 0

      while (true) {
        const showsFromAPI = await getShows(this.lastFetchedPage)

        this.shows.push(...showsFromAPI)
        this.incrementLastFetchedPage()

        const currentCount = this.genreBasedShows[genre] ? this.genreBasedShows[genre].length : 0

        if (currentCount - initialCount >= newEntries) {
          break
        }
      }
    },

    async searchShows(query: string) {
      const showsWithScoreFromAPI: ShowWithScore[] = await searchShows(query)

      const showsFromAPI: Show[] = showsWithScoreFromAPI.map(
        (showWithRating: ShowWithScore) => showWithRating.show,
      )

      this.searchedShows = showsFromAPI
    },

    incrementLastFetchedPage() {
      this.lastFetchedPage++
    },

    setCacheDate() {
      if (!this.cacheDate) {
        this.cacheDate = new Date()
      }
    },

    getShowById(id: number) {
      const mergedShows = [...this.shows, ...this.searchedShows]

      return mergedShows.find((show) => show.id === id)
    },
  },

  persist: {
    beforeHydrate: clearExpiredCache,
  },
})
