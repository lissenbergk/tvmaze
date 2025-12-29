import { useSettingsStore } from '@/stores/settings.store'
import { useShowsStore } from '@/stores/shows.store'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SearchShows from '../SearchShows.vue'

describe('component: SearchShows', () => {
  let settingsStore: ReturnType<typeof useSettingsStore>
  let showsStore: ReturnType<typeof useShowsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    settingsStore = useSettingsStore()
    showsStore = useShowsStore()
  })

  it('searches for shows with the provided query', async () => {
    const wrapper = mount(SearchShows)
    const getShowsSpy = vi.spyOn(showsStore, 'searchShows').mockResolvedValue(undefined)

    await wrapper.find('input').setValue('Testmovie 123')
    await wrapper.find('form').trigger('submit')

    expect(getShowsSpy).toHaveBeenCalledExactlyOnceWith('Testmovie 123')
    expect(settingsStore.source).toBe('search')
  })

  it('resets the source when the reset button is clicked', async () => {
    settingsStore.setSource('search')
    const wrapper = mount(SearchShows)

    await wrapper.find('[data-testid="reset-button"]').trigger('click')

    expect(settingsStore.source).toBe('all')
  })
})
