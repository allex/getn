/**
 * A helper for get a value from an object by its path
 *
 * @author Allex Wang (allex.wxn@gmail.com) <https://iallex.com/>
 * MIT Licensed
 */

interface Kv<T> { [k: string ]: T; }

const hasOwnProperty = {}.hasOwnProperty

const hasOwn = (o: any, k: string): boolean => o && hasOwnProperty.call(o, k)

type TKey = string | undefined

/**
 * Parse nested json by a set of paths
 *
 * @param {Object} t The host object to get
 * @param {Array<string>} keys The target paths, should be a path list
 */
export const parseNs = <T extends Kv<any>> (
  t: T,
  keys: string[]
): {
  o: any;
  v: any;
  k: TKey;
  n?: number; // return the remain paths number (undefined if whole paths parased)
} => {
  if (!Array.isArray(keys)) {
    throw new Error('Invalid prop paths')
  }

  let o: any = t
  let k: string = ''
  const stack: Array<[any, string[]]> = []

  while (keys.length > 0) {
    stack.push([t, keys])
    keys = keys.slice(0)
    k = keys.shift()!

    if (hasOwn(t, k)) {
      o = t
      t = t[k]
    } else {
      const last = stack[stack.length - 1]

      do {
        const [ host, paths ] = stack.pop()!
        const l = paths.length
        let i = 0
        while (++i < l) {
          const ns = paths.slice(0, i + 1).join('.')
          if (hasOwn(host, ns)) {
            if (i < l - 1) {
              const ret = parseNs(host[ns], paths.slice(i + 1))
              if (ret.n === undefined) {
                return ret
              }
            } else {
              return {
                o: host,
                k: ns,
                v: host[ns]
              }
            }
          }
        }
      } while (stack.length)

      return {
        o: last[0],
        k,
        v: undefined,
        n: keys.length + 1
      }
    }
  }

  return { o, k, v: t }
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
