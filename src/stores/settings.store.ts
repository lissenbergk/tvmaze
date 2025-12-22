import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    sortingOrder: 'desc' as 'asc' | 'desc',
  }),

  actions: {
    setSortingOrder(order: 'asc' | 'desc') {
      this.sortingOrder = order
    },
  },
})
