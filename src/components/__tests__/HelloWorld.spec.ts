import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
// @ts-ignore
import HelloWorld from '../HelloWorld.vue'
import moment from 'moment';
// @ts-ignore
import DynamicForm from '../DynamicForm.vue';

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})

describe('DynamicForm', () => {
  it('formats "nuechtern" field correctly', async () => {
    const mockResponse = [
      {
        id: 1,
        name: 'Drink 1',
        alcGehalt: 5,
        ml: 250,
        getrunken: '2023-07-01T09:30:00',
        nuechtern: '2023-07-01T10:30:00'
      },
      {
        id: 2,
        name: 'Drink 2',
        alcGehalt: 10,
        ml: 500,
        getrunken: '2023-07-01T15:45:00',
        nuechtern: '2023-07-01T16:30:00'
      }
    ];

    const mockFetch = () => Promise.resolve({
      json: () => Promise.resolve(mockResponse),
      ok: true,
      status: 200,
      headers: new Headers()
    });

    // @ts-ignore
    global.fetch = mockFetch;

    const wrapper = mount(DynamicForm);
    await wrapper.vm.loadDrinks();

    const formattedNuechtern1 = moment(mockResponse[0].nuechtern,  'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const formattedNuechtern2 = moment(mockResponse[1].nuechtern,  'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    expect('2023-07-01 10:30:00').toBe(formattedNuechtern1);
    expect('2023-07-01 16:30:00').toBe(formattedNuechtern2);
  });
});
