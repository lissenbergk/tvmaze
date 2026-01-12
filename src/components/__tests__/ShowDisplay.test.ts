import { dummyShows } from '@/types/__tests__/shows.dummy'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ShowDisplay from '../ShowDisplay.vue'

describe('component: ShowDisplay', () => {
  it('renders show data correctly', () => {
    const show = dummyShows[0]!

    const wrapper = mount(ShowDisplay, {
      props: {
        show: show,
      },
    })

    expect(wrapper.find('img').attributes('src')).toContain(show.image?.original)
    expect(wrapper.find('.text').find('h2').text()).toContain(show?.name)
    expect(wrapper.find('.text').find('h3').text()).toContain(show?.status)
    expect(wrapper.find('.rating').text()).toContain(show?.rating?.average)
  })

  it('does not render rating if not present', () => {
    const show = dummyShows[9]!

    const wrapper = mount(ShowDisplay, {
      props: {
        show: show,
      },
    })

    expect(wrapper.find('.rating').exists()).toBe(false)
  })
})
