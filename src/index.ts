/**
 * A helper for get a value from an object by its path
 *
 * @author Allex Wang (allex.wxn@gmail.com) <https://iallex.com/>
 * MIT Licensed
 */

interface Kv<T> { [k: string ]: T; }

export const parseNs = <T extends Kv<any>> (o: T, arr: string[]): {
  o: any;
  v: any;
  k: string | undefined;
} => {
  arr = arr.slice(0)
  let backtrack: string[] = []
  let k: string | undefined
  // tmp for swap
  let t: any = o
  while (arr.length) {
    k = arr.join('.')
    const last = arr.pop()!
    o = t
    if (k in o) {
      t = o[k]
      arr = backtrack.length ? backtrack : []
      backtrack = []
    } else {
      backtrack.unshift(last)
    }
  }
  const l = backtrack.length
  if (l) {
    let i = -1
    while ((k = backtrack[++i])) {
      o = t
      if (k in o) {
        t = o[k]
      } else {
        if (i > 0 && i < l - 1) {
          return parseNs(o, backtrack.slice(i))
        } else {
          t = undefined
          break
        }
      }
    }
  }
  return { o, v: t, k }
}

export const getv = <T extends Kv<any>> (o: T, ns: string) => {
  const model = parseNs(o, ns.split('.'))
  return model.v
}
