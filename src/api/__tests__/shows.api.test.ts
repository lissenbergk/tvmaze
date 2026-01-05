import { dummyShows } from '@/types/__tests__/shows.dummy'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getShows, searchShows } from '../shows.api'

describe('api: shows', () => {
  const mockBaseUrl = 'https://api.tvmaze.com'

  beforeEach(() => {
    vi.stubEnv('VITE_TVMAZE_BASE_URL', mockBaseUrl)
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('function: getShows', () => {
    it('correctly builds the url', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => dummyShows,
      } as Response)

      await getShows(0)

      expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}shows?page=0`)
    })

    it('throws an error if response status is not ok', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => dummyShows,
      } as Response)

      await expect(getShows(0)).rejects.toThrowError('API error: getShows(), response was not OK')
    })
  })

  describe('function: searchShows', () => {
    it('correctly builds the url', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => dummyShows,
      } as Response)

      await searchShows('Test')

      expect(fetch).toHaveBeenCalledWith(`${mockBaseUrl}search/shows?q=Test`)
    })

    it('throws an error if response status is not ok', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => dummyShows,
      } as Response)

      await expect(searchShows('Test')).rejects.toThrowError(
        'API error: searchShows(), response was not OK',
      )
    })
  })
})
