import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSettingsStore } from '../settings.store'

describe('store: settings', () => {
  let settingsStore: ReturnType<typeof useSettingsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    settingsStore = useSettingsStore()
  })

  it('loads in with the desc default sortingOrder value', () => {
    expect(settingsStore.sortingOrder).toBe('desc')
  })

  it('loads in with the all default source value', () => {
    expect(settingsStore.source).toBe('all')
  })

  it('changes sortingOrder value to specified order', () => {
    settingsStore.setSortingOrder('asc')

    expect(settingsStore.sortingOrder).toBe('asc')
  })

  it('changes source value to specified source', () => {
    settingsStore.setSource('search')

    expect(settingsStore.source).toBe('search')
  })
})
