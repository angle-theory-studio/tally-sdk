import { TallySDK } from '..'

async function __ex() {
  const client = TallySDK.test()
  void client
  {
    const client = TallySDK.test()
    
    const workoutlog = await client.WorkoutLog().list()
    // workoutlog is the entity, populated with mock response data
    // — call workoutlog.data() for the record itself
    console.log(workoutlog)
    
  }
}
void __ex
