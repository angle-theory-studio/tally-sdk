import { TallySDK } from '..'

async function __ex() {
  const client = TallySDK.test()
  void client
  {
    const workoutlog = client.WorkoutLog()
    await workoutlog.list()
    
    // workoutlog.data() now returns the workoutlog data from the last `list`
    // workoutlog.match() returns the last match criteria
    
  }
}
void __ex
