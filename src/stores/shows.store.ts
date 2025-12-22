import { getShows } from '@/api/shows.api'
import { type Show } from '@/types/types'
import { defineStore } from 'pinia'
import { useSettingsStore } from './settings.store'

export const useShowsStore = defineStore('shows', {
  state: () => ({
    shows: [] as Show[],
    lastFetchedPage: 0 as number,
  }),

  getters: {
    genreBasedShows(state) {
      const genreBasedShows = {}
      const settingsStore = useSettingsStore()
      const sortingOrder = settingsStore.sortingOrder

      for (const show of state.shows) {
        for (const genre of show.genres) {
          if (!genreBasedShows[genre]) {
            genreBasedShows[genre] = []
          }

          genreBasedShows[genre].push(show)
        }
      }

      for (const genre of Object.keys(genreBasedShows)) {
        genreBasedShows[genre] = genreBasedShows[genre].sort((a: Show, b: Show) =>
          sortingOrder === 'asc'
            ? a.rating.average - b.rating.average
            : b.rating.average - a.rating.average,
        )
      }

      return genreBasedShows
    },
  },

  actions: {
    async getShows() {
      const showsFromAPI = await getShows(this.lastFetchedPage)

      this.shows.push(...showsFromAPI)
      this.incrementLastFetchedPage()
    },

    incrementLastFetchedPage() {
      this.lastFetchedPage++
    },
  },
})
