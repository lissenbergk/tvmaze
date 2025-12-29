import { getShows, searchShows } from '@/api/shows.api'
import { dummyShows } from '@/types/__tests__/shows.dummy'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSettingsStore } from '../settings.store'
import { useShowsStore } from '../shows.store'

vi.mock('@/api/shows.api')

describe('store: shows', () => {
  let showsStore: ReturnType<typeof useShowsStore>
  let settingsStore: ReturnType<typeof useSettingsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    showsStore = useShowsStore()
    settingsStore = useSettingsStore()
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
})
