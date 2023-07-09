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
    // @ts-ignore
    await wrapper.vm.loadDrinks();

    const formattedNuechtern1 = moment(mockResponse[0].nuechtern,  'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const formattedNuechtern2 = moment(mockResponse[1].nuechtern,  'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    expect('2023-07-01 10:30:00').toBe(formattedNuechtern1);
    expect('2023-07-01 16:30:00').toBe(formattedNuechtern2);
  });
});

describe('DynamicForm', () => {
  it('sends the correct JSON body when saving', async () => {
    const expectedData = {
      name: 'Test Drink',
      alcGehalt: '5',
      ml: '250'
    };

    let requestPayload;
    // @ts-ignore
    const mockFetch = (url, options) => {
      console.log('options.body:', options.body);
      requestPayload = JSON.parse(options.body);
      console.log('requestPayload:', requestPayload);
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers()
      });
    };

    // @ts-ignore
    global.fetch = mockFetch;

    const wrapper = mount(DynamicForm);
    await wrapper.setData({
      nameField: expectedData.name,
      alcGehaltField: expectedData.alcGehalt,
      mlField: expectedData.ml
    });

    // @ts-ignore
    await wrapper.vm.save();

    expect(requestPayload).toEqual(expectedData);
  });
});
