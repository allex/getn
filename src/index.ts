/**
 * A helper for get a value from an object by its path
 *
 * @author Allex Wang (allex.wxn@gmail.com) <https://iallex.com/>
 * MIT Licensed
 */

interface Kv<T> { [k: string ]: T; }

const hasOwnProperty = {}.hasOwnProperty

const hasOwn = (o: any, k: string): boolean => hasOwnProperty.call(o, k)

export const parseNs = <T extends Kv<any>> (
  o: T,
  arr: string[],
  count?: number /* internal parameter */
): {
  o: any;
  v: any;
  k: string | undefined;
  n: number; // return the remain paths number (0 if whole paths parased)
} => {
  if (!Array.isArray(arr)) {
    throw new Error('Invalid prop paths')
  }
  arr = arr.slice(0)
  count = count === undefined ? arr.length : count
  let backtrack: string[] = []
  let k: string | undefined

  // tmp for swap
  let t: any = o

  while (arr.length) {
    k = arr.join('.')
    const last = arr.pop()!
    if (t && hasOwn(t, k)) {
      o = t
      t = o[k]
      count -= (arr.length + 1)
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
      if (hasOwn(t, k)) {
        o = t
        t = o[k]
        count -= 1
      } else {
        if (i > 0 && i < l - 1) {
          return parseNs(t, backtrack.slice(i), count)
        } else {
          t = undefined
          break
        }
      }
    }
  }

  return { o, v: t, k, n: count }
}

export const getv = <T extends Kv<any>> (o: T, ns: string) => {
  const model = parseNs(o, ns.split('.'))
  return model.v
}
