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
