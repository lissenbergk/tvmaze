import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useShowsStore } from '@/stores/shows.store'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import HomeView from '@/views/HomeView.vue'
import { dummyShows } from '@/types/__tests__/shows.dummy'

describe('HomeView', () => {
  const mountOptions = {
    global: {
      stubs: {
        FontAwesomeIcon: {
          template: '<i v-bind="$attrs"></i>',
        },
      },
    },
  }

  let showsStore: ReturnType<typeof useShowsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    showsStore = useShowsStore()
  })

  describe('on mount', () => {
    it('loads shows if none exist', () => {
      const getShowsSpy = vi.spyOn(showsStore, 'getShows').mockResolvedValue([])

      mount(HomeView, mountOptions)

      expect(getShowsSpy).toHaveBeenCalled()
    })
  })

  describe('show modal', () => {
    it('opens when a show is clicked', async () => {
      showsStore.shows = dummyShows
      vi.spyOn(showsStore, 'getShows').mockResolvedValue([])

      const wrapper = mount(HomeView, mountOptions)
      const showDisplay = wrapper.findComponent({
        name: 'ShowDisplay',
        props: { show: dummyShows[0] },
      })

      await showDisplay.trigger('click')

      expect(wrapper.vm.showModal).toBe(true)
    })

    it('closes when close-modal event is emitted', async () => {
      showsStore.shows = dummyShows

      const wrapper = mount(HomeView, mountOptions)
      wrapper.vm.showModal = true
      wrapper.vm.selectedShowId = 1
      await nextTick()

      const showModal = wrapper.findComponent({ name: 'ShowModal' })
      await showModal.vm.$emit('close-modal')
      await nextTick()

      expect(wrapper.vm.showModal).toBe(false)
    })
  })

  describe('load more functionality', () => {
    it('fetches more shows when load more button is clicked', async () => {
      showsStore.shows = dummyShows
      const getMoreShowsSpy = vi.spyOn(showsStore, 'getMoreShows').mockResolvedValue(undefined)

      const wrapper = mount(HomeView, mountOptions)
      await nextTick()

      const loadMoreButton = wrapper.find('.load-more-button')
      await loadMoreButton.trigger('click')

      expect(getMoreShowsSpy).toHaveBeenCalled()
    })
  })
})
