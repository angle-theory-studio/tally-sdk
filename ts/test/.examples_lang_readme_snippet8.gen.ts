import { TallySDK } from '..'

async function __ex() {
  const client = TallySDK.test()
  void client
  {
    const entity = client.WorkoutLog()
    
    // First call runs the operation and stores its result
    await entity.list()
    
    // Subsequent calls reuse the stored state
    const data = entity.data()
    console.log(data.id)
    
  }
}
void __ex
