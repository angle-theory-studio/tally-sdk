
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { TallySDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = TallySDK.test()
    equal(testsdk instanceof TallySDK, true,
      'TallySDK.test() must return a client synchronously')
  })

})
