import { TallySDK } from '..'

async function __ex() {
  const client = TallySDK.test()
  void client
  {
    const logger = {
      hooks: {
        PreRequest: (ctx: any) => {
          console.log('Requesting:', ctx.spec.method, ctx.spec.path)
        },
        PreResponse: (ctx: any) => {
          console.log('Status:', ctx.out.request?.status)
        },
      },
    }
    
    const client = new TallySDK({
      apikey: '...',
      extend: [logger],
    })
    
  }
}
void __ex
