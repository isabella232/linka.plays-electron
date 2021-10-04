import { use, expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import CatchButterfly from '@/Games/CatchButterfly/CatchButterfly.vue'

describe('CatchButterfly.vue', () => {
  it('renders catch butterfly game.', () => {

    const wrapper = shallowMount(CatchButterfly )
    
    expect(wrapper.exists()).equal(true)

    expect(wrapper.vm.$data.point.x).is('number');
    expect(wrapper.vm.$data.point.y).is('number');
    const pointBeforeHit = wrapper.vm.$data.point;
    (wrapper.vm as any).hit()
    expect(wrapper.vm.$data.point).equal(pointBeforeHit)
  })
})
