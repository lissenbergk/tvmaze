import { getShows, searchShows } from '@/api/shows.api'
import { type Show, type ShowWithScore } from '@/types/types'
import { clearExpiredCache } from '@/utils/cache'
import { groupShowsByGenre } from '@/utils/shows'
import { defineStore } from 'pinia'
import { useSettingsStore } from './settings.store'

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
      const settingsStore = useSettingsStore()
      return groupShowsByGenre(this.showsBasedOnSource, settingsStore.sortingOrder)
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
      let attempts = 0

      while (attempts <= 5) {
        const showsFromAPI = await getShows(this.lastFetchedPage)

        this.shows.push(...showsFromAPI)
        this.incrementLastFetchedPage()
        attempts += 1

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
      return [...this.shows, ...this.searchedShows].find((show) => show.id === id)
    },
  },

  persist: {
    beforeHydrate: clearExpiredCache,
  },
})
