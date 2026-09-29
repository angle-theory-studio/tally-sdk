
import { Context } from '../types'


function prepareQuery(ctx: Context) {
  const utility = ctx.utility
  const struct = utility.struct
  const items = struct.items

  const point = ctx.point
  // Generated points describe path arguments in args.params. Keep the
  // legacy name list supported for older/custom points and the utility corpus.
  const params = new Set<string>(point.params || [])
  for (const param of point.args?.params || []) {
    params.add('string' === typeof param ? param : param.name)
  }
  const reqmatch = ctx.reqmatch || {}

  const out: any = {}
  for (let [key, val] of items(reqmatch)) {
    if (null != val && '$action' !== key && !params.has(key)) {
      out[key] = val
    }
  }

  return out
}


export {
  prepareQuery
}
