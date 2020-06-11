/**
 * A helper for get a value from an object by its path
 *
 * @author Allex Wang (allex.wxn@gmail.com) <https://iallex.com/>
 * MIT Licensed
 */

interface Kv<T> { [k: string ]: T; }

const hasOwnProperty = {}.hasOwnProperty

const hasOwn = (o: any, k: string): boolean => o && hasOwnProperty.call(o, k)

/**
 * Parse nested json by a set of paths
 *
 * @param {Object} o The host object to get
 * @param {Array<string>} arr The target paths, should be a path list
 */
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
    if (hasOwn(t, k)) {
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

/**
 * Get a value from an object by its path
 *
 * @param {Object} o The host object to get
 * @param {Array<string>} ns The target path namespace with dot(.) identifier
 * @param {T} defVal Returns the default value if target value is undefined
 */
export const getv = <T> (o: any, ns: string, defVal?: T) => {
  const model = parseNs(o, ns.split('.'))
  const v = model.v
  return v === undefined ? defVal : v
}
