import { getShows, searchShows } from '@/api/shows.api'
import { dummyShows } from '@/types/__tests__/shows.dummy'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSettingsStore } from '../settings.store'
import { clearExpiredCache, useShowsStore } from '../shows.store'

vi.mock('@/api/shows.api')

describe('store: shows', () => {
  let showsStore: ReturnType<typeof useShowsStore>
  let settingsStore: ReturnType<typeof useSettingsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    showsStore = useShowsStore()
    settingsStore = useSettingsStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('provides showed based on genre in the correct order', () => {
    showsStore.shows = dummyShows

    expect(showsStore.genreBasedShows['Action'][0].rating.average).toBe(8.8)

    settingsStore.sortingOrder = 'asc'
    expect(showsStore.genreBasedShows['Action'].at(-1).rating.average).toBe(8.8)
  })

  it('provides shows based on source', () => {
    showsStore.shows = dummyShows
    showsStore.searchedShows = [dummyShows[0]!]

    settingsStore.source = 'all'
    expect(showsStore.showsBasedOnSource).toEqual(dummyShows)

    settingsStore.source = 'search'
    expect(showsStore.showsBasedOnSource).toEqual([dummyShows[0]])
  })

  it('fetches shows from the api', async () => {
    const getShowsSpy = vi.mocked(getShows).mockResolvedValue(dummyShows)

    await showsStore.getShows()

    expect(getShowsSpy).toHaveBeenCalledOnce()
    expect(showsStore.shows).toEqual(dummyShows)
  })

  it('fetches show by id', () => {
    showsStore.shows = dummyShows

    const show = showsStore.getShowById(1)

    expect(show).toEqual(dummyShows[0])
  })

  it('returns undefined when show id is not found', () => {
    showsStore.shows = dummyShows

    const show = showsStore.getShowById(99999)

    expect(show).toBeUndefined()
  })

  it('searches for shows from the api', async () => {
    const searchShowsSpy = vi
      .mocked(searchShows)
      .mockResolvedValue([{ score: 1, show: dummyShows[0]! }])

    await showsStore.searchShows('Testmovie 123')

    expect(searchShowsSpy).toHaveBeenCalledWith('Testmovie 123')
    expect(showsStore.searchedShows).toEqual([dummyShows[0]])
  })

  it('increments the last fetched page', () => {
    showsStore.lastFetchedPage = 0

    showsStore.incrementLastFetchedPage()

    expect(showsStore.lastFetchedPage).toBe(1)
  })

  it('sets cache date when not set', () => {
    expect(showsStore.cacheDate).toBeUndefined()

    showsStore.setCacheDate()

    expect(showsStore.cacheDate).toBeInstanceOf(Date)
  })

  it('does not overwrite cache date when already set', () => {
    const existingDate = new Date('2024-01-01')
    showsStore.cacheDate = existingDate

    showsStore.setCacheDate()

    expect(showsStore.cacheDate).toBe(existingDate)
  })

  it('returns visible shows for a genre based on loaded count', () => {
    showsStore.shows = dummyShows
    showsStore.genreLoadedCounts = { Action: 2 }

    const visibleShows = showsStore.getVisibleShowsForGenre('Action')

    expect(visibleShows).toHaveLength(2)
  })

  it('returns no visible shows works when fallback values are used', () => {
    const visibleShows = showsStore.getVisibleShowsForGenre('Action')

    expect(visibleShows).toHaveLength(0)
  })

  it('returns shows for genre when available', async () => {
    showsStore.shows = dummyShows

    await showsStore.getShowsForGenre('Drama', 2)

    expect(showsStore.genreLoadedCounts['Drama']).toEqual(2)
  })

  it('fetches more shows for genre if not enough shows are available', async () => {
    const getShowsSpy = vi.mocked(getShows)

    await showsStore.getShowsForGenre('Drama', 20)

    expect(getShowsSpy).toHaveBeenCalled()
  })

  it('fetches more shows until enough shows are available', async () => {
    showsStore.shows = dummyShows.slice(0, 2)

    const getShowsSpy = vi
      .mocked(getShows)
      .mockResolvedValueOnce(dummyShows.slice(2, 4))
      .mockResolvedValueOnce(dummyShows.slice(4, 6))

    await showsStore.getMoreShows('Action', 3)

    expect(getShowsSpy).toHaveBeenCalled()
    expect(showsStore.lastFetchedPage).toBeGreaterThan(0)
  })

  it('clears expired cache', () => {
    const mockNow = new Date('2026-01-12').getTime()
    vi.spyOn(Date, 'now').mockReturnValue(mockNow)

    const expiredDate = new Date('2026-01-05').toISOString()
    const expiredData = JSON.stringify({
      shows: dummyShows,
      cacheDate: expiredDate,
    })

    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(expiredData)
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    clearExpiredCache()

    expect(getItemSpy).toHaveBeenCalledWith('shows')
    expect(consoleLogSpy).toHaveBeenCalledWith('📺 Cache expired, clearing storage')
    expect(removeItemSpy).toHaveBeenCalledWith('shows')
  })
})
