import { useShowsStore } from '@/stores/shows.store'
import { dummyShows } from '@/types/__tests__/shows.dummy'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import ShowModal from '../ShowModal.vue'

describe('component: ShowModal', () => {
  let showsStore: ReturnType<typeof useShowsStore>

  const createWrapper = (props = {}) => {
    return mount(ShowModal, {
      props: {
        visible: true,
        showId: 1,
        ...props,
      },
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
    showsStore.shows = dummyShows
  })

  it('renders the modal when the prop visible is true', () => {
    const wrapper = createWrapper()

    const innerModal = wrapper.find('.inner-modal')

    expect(innerModal.exists()).toBe(true)
  })

  it('renders show data correctly', () => {
    const dummyShow = dummyShows[0]
    const wrapper = createWrapper()

    expect(wrapper.find('img').attributes('src')).toBe(dummyShow?.image?.original)
    expect(wrapper.find('ul').text()).toContain(dummyShow?.genres[0])
    expect(wrapper.find('.runtime-tag').text()).toContain(String(dummyShow?.runtime))
    expect(wrapper.find('.rating-tag').text()).toContain(String(dummyShow?.rating?.average))
    expect(wrapper.find('p').html()).toContain(dummyShow?.summary)
  })

  it('emits the close-modal event when the exit button is clicked', async () => {
    const wrapper = createWrapper()

    await wrapper.find('.exit').trigger('click')

    expect(wrapper.emitted('close-modal')).toHaveLength(1)
  })

  it('does not render when showId is undefined', () => {
    const wrapper = createWrapper({ showId: undefined })

    expect(wrapper.find('.inner-modal').exists()).toBe(false)
  })

  it('does not render when showId does not match an existing show', () => {
    const wrapper = createWrapper({ showId: 99999999 })

    expect(wrapper.find('.inner-modal').exists()).toBe(false)
  })

  it('does not render image when show has no image', () => {
    const wrapper = createWrapper({ showId: 10 })

    expect(wrapper.find('img').exists()).toBe(false)
  })
})
