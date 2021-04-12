import { shallowMount, createLocalVue } from '@vue/test-utils'
import SafeDepositBox from '@/components/SafeDepositBox.vue'
import Vuex from 'vuex'

// tried testing but couldn't handle it

const localVue = createLocalVue()
localVue.use(Vuex)

describe('SafeDepositBox', () => { 
  let actions
  let store

  beforeEach(() => {
    actions = {
      inputValue: jest.fn(),
    }
    store = new Vuex.Store({
      actions
    })
  })

  it('call store action "inputValue" when button is clicked', () => {
    const wrapper = shallowMount(SafeDepositBox, { store, localVue })
    wrapper.findAll('button').at(0).trigger('click')
    expect(actions.inputValue).toHaveBeenCalled()
  })

})
