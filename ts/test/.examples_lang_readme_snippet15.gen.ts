import { TallySDK } from '..'

async function __ex() {
  const client = TallySDK.test()
  void client
  {
    const food_entry = await client.FoodEntry().create({
      input: 'example_input',
    })
    
  }
}
void __ex
