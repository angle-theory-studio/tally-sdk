import { TallySDK } from '..'

async function __ex() {
  const client = TallySDK.test()
  void client
  {
    const result = await client.direct({
      path: '/api/resource/{id}',
      method: 'GET',
      params: { id: 'example_id' },
    })
    
    if (result instanceof Error) {
      throw result
    }
    
  }
}
void __ex
