import { TallySDK } from '..'

async function __ex() {
  const client = TallySDK.test()
  void client
  {
    try {
      const workoutlogs = await client.WorkoutLog().list()
      console.log(workoutlogs)
    } catch (err) {
      console.error('list failed:', err)
    }
    
  }
}
void __ex
