import { useShowsStore } from '@/stores/shows.store'
import { dummyShows } from '@/types/__tests__/shows.dummy'
import HomeView from '@/views/HomeView.vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

describe('view: HomeView', () => {
  let showsStore: ReturnType<typeof useShowsStore>

  const createWrapper = () => {
    return mount(HomeView, {
      global: {
        stubs: {
          FontAwesomeIcon: {
            template: '<i v-bind="$attrs"></i>',
          },
        },
      },
    })
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    showsStore = useShowsStore()
  })

  it('fetches shows on mount when none exist', () => {
    const getShowsSpy = vi.spyOn(showsStore, 'getShows').mockResolvedValue(undefined)
    const wrapper = createWrapper()
    expect(getShowsSpy).toHaveBeenCalled()
  })

  it('opens modal when a show is clicked', async () => {
    vi.spyOn(showsStore, 'getShows').mockResolvedValue(undefined)
    showsStore.shows = dummyShows

    const wrapper = createWrapper()

    const showDisplay = wrapper.findComponent({
      name: 'ShowDisplay',
      props: { show: dummyShows[0] },
    })

    await showDisplay.trigger('click')

    expect(wrapper.vm.showModal).toBe(true)
  })

  it('emits close-modal event when close modal button is clicked', async () => {
    showsStore.shows = dummyShows

    const wrapper = createWrapper()
    wrapper.vm.showModal = true
    wrapper.vm.selectedShowId = 1
    await nextTick()

    const showModal = wrapper.findComponent({ name: 'ShowModal' })
    await showModal.vm.$emit('close-modal')
    await nextTick()

    expect(wrapper.vm.showModal).toBe(false)
  })

  it('loads more shows when load more button is clicked', async () => {
    const getMoreShowsSpy = vi.spyOn(showsStore, 'getShowsForGenre').mockResolvedValue(undefined)
    showsStore.shows = dummyShows

    const wrapper = createWrapper()
    const loadMoreButton = wrapper.find('.load-more-button')
    await loadMoreButton.trigger('click')

    expect(getMoreShowsSpy).toHaveBeenCalled()
  })
})
