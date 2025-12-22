import { getShows } from '@/api/shows.api'
import { type Show } from '@/types/types'
import { defineStore } from 'pinia'

export const useShowsStore = defineStore('shows', {
  state: () => ({
    shows: [] as Show[],
    lastFetchedPage: 0 as number,
  }),

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
