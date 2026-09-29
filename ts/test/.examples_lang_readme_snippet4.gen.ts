import { TallySDK } from '..'

async function __ex() {
  const client = TallySDK.test()
  void client
  {
    const result = await client.direct({
      path: '/api/resource/{id}',
      method: 'GET',
      params: { id: 'example' },
    })
    
    if (result instanceof Error) {
      throw result
    }
    if (result.ok) {
      console.log(result.status)  // 200
      console.log(result.data)    // response body
    }
    
  }
}
void __ex
