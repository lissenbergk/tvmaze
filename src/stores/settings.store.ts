import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    sortingOrder: 'desc' as 'asc' | 'desc',
    source: 'all' as 'all' | 'search',
  }),

  actions: {
    setSortingOrder(order: 'asc' | 'desc') {
      this.sortingOrder = order
    },

    setSource(source: 'all' | 'search') {
      this.source = source
    },
  },

  persist: true,
})
