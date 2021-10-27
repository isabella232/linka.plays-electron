import { assert, expect } from 'chai'
import { Point } from 'paper/dist/paper-core';
import {  MiddleValueFilter } from "@/EyeFilters/MiddleValueFilter";
import { shallowMount } from '@vue/test-utils'

describe('MiddleValueFilter', () => {
  it('finds middle value', () => {
    const filter = new MiddleValueFilter

    const value = filter.addPoint(new Point(1, 1))
    assert.equal(value.x, 1)
  })
})
