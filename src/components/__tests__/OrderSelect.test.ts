import { useSettingsStore } from '@/stores/settings.store'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import OrderSelect from '../OrderSelect.vue'

describe('component: OrderSelect', () => {
  let settingsStore: ReturnType<typeof useSettingsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    settingsStore = useSettingsStore()
  })

  it('shows all order options', () => {
    const wrapper = mount(OrderSelect)
    const options = wrapper.find('select').findAll('option')

    expect(options).toHaveLength(2)
    expect(options[0]?.text()).toBe('Descending')
    expect(options[1]?.text()).toBe('Ascending')
  })

  it('loads in the correct option from the store', () => {
    settingsStore.sortingOrder = 'asc'

    const wrapper = mount(OrderSelect)

    expect(wrapper.vm.order).toBe('asc')
  })

  it('sets the order when the select changes value', () => {
    const wrapper = mount(OrderSelect)
    const select = wrapper.find('select')

    select.setValue('asc')

    expect(wrapper.vm.order).toBe('asc')
  })
})
