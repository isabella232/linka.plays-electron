import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Butterfly from '@/Games/Butterfly/Butterfly.vue'

describe('Butterfly.vue', () => {
  it('renders butterfly game', () => {

    const wrapper = shallowMount(Butterfly )
    expect(wrapper.exists()).equal(true)
  })
})
