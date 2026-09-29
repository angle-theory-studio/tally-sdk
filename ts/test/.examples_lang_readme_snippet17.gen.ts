import { TallySDK } from '..'

async function __ex() {
  const client = TallySDK.test()
  void client
  {
    const mood_entry = await client.MoodEntry().create({
      body: 'example_body',
    })
    
  }
}
void __ex
