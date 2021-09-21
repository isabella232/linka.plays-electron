import { use, expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import CatchButterfly from '@/Games/CatchButterfly/CatchButterfly.vue'

describe('CatchButterfly.vue', () => {
  it('renders butterfly game', () => {

    const wrapper = shallowMount(CatchButterfly )
    
    expect(wrapper.exists()).equal(true)

    console.log(wrapper.vm.$data);
    
  })
})
