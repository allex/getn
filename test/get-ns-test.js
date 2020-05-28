import assert from 'assert'

import { getv, parseNs } from '../'

describe('predicate', () => {
  var o = {
    a: {
      b: {
        c: {
          d: 1,
          'k.k': 'k'
        }
      },
      c: {
        d: {
          k: 2,
          'k.k': 3
        }
      },
      'c.d': {
        f: 4,
        'k.n': 5,
        'o.b': {
          k1: '6'
        }
      },
      'c.d.e': 7,
      'attrs.tt': [1, 2, 3, 4]
    }
  }

  test('get by ns asserts', () => {
    assert.equal(getv(o, 'a.b'), o.a.b, 'a.b')
    assert.equal(getv(o, 'a.b.c.d'), o.a.b.c.d, 'a.b.c.d')
    assert.deepEqual(getv(o, 'a.c.d'), o.a['c.d'], 'a.c.d')
    assert.deepEqual(getv(o, 'a.c.d.f'), o.a['c.d'].f, "a['c.d'].f")
    assert.deepEqual(getv(o, 'a.c.d.k.n'), o.a['c.d']['k.n'], "a['c.d']['k.n']")
    assert.deepEqual(getv(o, 'a.c.d.o.b.k1'), o.a['c.d']['o.b'].k1, "o.a['c.d']['o.b'].k1")
    assert.deepEqual(getv(o, 'a.c.d.e'), o.a['c.d.e'], "a['c.d.e']")
    assert.deepEqual(getv(o, 'a.attrs.tt.3'), o.a['attrs.tt'][3], "a['attrs.tt'][3]")
  })

  test('trace parseNs count', () => {
    const path = 'a.dd.xx.n.k'.split('.') // only first step valid
    const model = parseNs(o, path)
    assert.equal(model.k, path[1])
    assert.equal(model.v, undefined, 'invalid paths')
    assert.equal(model.n, path.length - 1, 'invalid paths trace position')
  })

  test('trace parseNs count deeply', () => {
    // o.a['c.d']['o.b']...
    const path = 'a.c.d.o.b.no_exist.foo'.split('.')
    const model = parseNs(o, path)
    assert.equal(model.k, 'no_exist')
    assert.equal(model.n, 2, 'invalid paths trace position')
  })
})
