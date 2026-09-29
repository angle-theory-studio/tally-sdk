import { TallySDK } from '..'

async function __ex() {
  const client = TallySDK.test()
  void client
  {
    const fetchdef = await client.prepare({
      path: '/api/resource/{id}',
      method: 'DELETE',
      params: { id: 'example' },
    })
    
    // Inspect before sending
    console.log(fetchdef.url)
    console.log(fetchdef.method)
    console.log(fetchdef.headers)
    
  }
}
void __ex
