import { getShows, searchShows } from '@/api/shows.api'
import { type Show, type ShowWithScore } from '@/types/types'
import { defineStore } from 'pinia'
import { useSettingsStore } from './settings.store'

export const useShowsStore = defineStore('shows', {
  state: () => ({
    shows: [] as Show[],
    searchedShows: [] as Show[],
    lastFetchedPage: 0 as number,
  }),

  getters: {
    genreBasedShows(state) {
      const genreBasedShows = {}
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
        genreBasedShows[genre] = genreBasedShows[genre].sort((a: Show, b: Show) =>
          sortingOrder === 'asc'
            ? a.rating.average - b.rating.average
            : b.rating.average - a.rating.average,
        )
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
    },

    async searchShows(query: string) {
      const settingsStore = useSettingsStore()
      const showsWithScoreFromAPI: ShowWithScore[] = await searchShows(query)

      console.log(showsWithScoreFromAPI)

      const showsFromAPI: Show[] = showsWithScoreFromAPI.map(
        (showWithRating: ShowWithScore) => showWithRating.show,
      )

      console.log(showsFromAPI)

      this.searchedShows = showsFromAPI
    },

    incrementLastFetchedPage() {
      this.lastFetchedPage++
    },

    getShowById(id: number) {
      const mergedShows = [...this.shows, ...this.searchedShows]

      return mergedShows.find((show) => show.id === id)
    },
  },

  persist: true,
})
