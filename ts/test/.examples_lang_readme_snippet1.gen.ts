import { TallySDK } from '..'

async function __ex() {
  const client = TallySDK.test()
  void client
  {
    const feeds = await client.Feed().list()
    
    for (const feed of feeds) {
      console.log(feed)
    }
    
  }
}
void __ex
